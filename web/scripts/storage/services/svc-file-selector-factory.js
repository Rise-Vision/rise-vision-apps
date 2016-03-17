'use strict';
angular.module('risevision.storage.services')
  .value('SELECTOR_TYPES', {
    SINGLE_FILE: 'single-file',
    MULTIPLE_FILE: 'multiple-file',
    SINGLE_FOLDER: 'single-folder'
  })
  .value('STORAGE_FILE_URL', 'https://storage.googleapis.com/')
  .value('STORAGE_CLIENT_API', 'https://www.googleapis.com/storage/v1/b/')
  .factory('fileSelectorFactory', ['$rootScope', '$window', 'filesFactory',
    'userState', 'gadgetsApi',
    '$loading', 'filterFilter', 'STORAGE_CLIENT_API', 'STORAGE_FILE_URL',
    'SELECTOR_TYPES',
    function ($rootScope, $window, filesFactory, userState, gadgetsApi,
      $loading, filterFilter, STORAGE_CLIENT_API, STORAGE_FILE_URL,
      SELECTOR_TYPES) {
      var factory = {};

      factory.storageFull = false;
      factory.isSingleFileSelector = function () {
        return factory.type === SELECTOR_TYPES.SINGLE_FILE;
      };
      factory.isMultipleFileSelector = function () {
        return factory.type === SELECTOR_TYPES.MULTIPLE_FILE;
      };
      factory.isSingleFolderSelector = function () {
        return factory.type === SELECTOR_TYPES.SINGLE_FOLDER;
      };

      //on all state Changes do not hold onto checkedFiles list
      $rootScope.$on('$stateChangeStart', function () {
        factory.resetSelections();
      });

      factory.resetSelections = function () {
        filesFactory.filesDetails.files.forEach(function (val) {
          val.isChecked = false;
        });

        filesFactory.filesDetails.checkedCount = 0;
        filesFactory.filesDetails.folderCheckedCount = 0;
        filesFactory.filesDetails.checkedItemsCount = 0;
      };

      factory.folderSelect = function (folder) {
        if (factory.fileIsFolder(folder)) {
          if (factory.isSingleFolderSelector()) {
            factory.postFileToParent(folder);
          } else if (!factory.isSingleFileSelector() && !factory.isMultipleFileSelector()) {
            factory.fileCheckToggled(folder);
          }
        }
      };

      factory.fileCheckToggled = function (file) {
        // ng-click is processed before btn-checkbox updates the model
        var checkValue = !file.isChecked;

        file.isChecked = checkValue;

        if (file.name.substr(-1) !== '/') {
          filesFactory.filesDetails.checkedCount += checkValue ? 1 : -1;
        } else {
          filesFactory.filesDetails.folderCheckedCount += checkValue ? 1 :
            -1;
        }

        filesFactory.filesDetails.checkedItemsCount += checkValue ? 1 : -1;
      };

      factory.selectAllCheckboxes = function (query) {
        var filteredFiles = filterFilter(filesFactory.filesDetails.files,
          query);

        factory.selectAll = !factory.selectAll;

        filesFactory.filesDetails.checkedCount = 0;
        filesFactory.filesDetails.folderCheckedCount = 0;
        filesFactory.filesDetails.checkedItemsCount = 0;
        for (var i = 0; i < filesFactory.filesDetails.files.length; ++i) {
          var file = filesFactory.filesDetails.files[i];

          if (factory.fileIsCurrentFolder(file) ||
            factory.fileIsTrash(file) ||
            (factory.fileIsFolder(file) && !(factory.storageFull ||
              factory.isSingleFolderSelector()))) {
            continue;
          }

          file.isChecked = factory.selectAll && filteredFiles.indexOf(file) >=
            0;

          if (file.name.substr(-1) !== '/') {
            filesFactory.filesDetails.checkedCount += file.isChecked ? 1 :
              0;
          } else {
            filesFactory.filesDetails.folderCheckedCount += file.isChecked ?
              1 : 0;
          }

          filesFactory.filesDetails.checkedItemsCount += file.isChecked ? 1 :
            0;
        }
      };

      factory.fileIsCurrentFolder = function (file) {
        return file.name === filesFactory.folderPath;
      };

      factory.fileIsFolder = function (file) {
        return file.name.substr(-1) === '/';
      };

      factory.fileIsTrash = function (file) {
        return file.name === '--TRASH--/';
      };
      
      var _getFileUrl = function(file) {
        var bucketName = 'risemedialibrary-' + userState.getSelectedCompanyId();
        var folderSelfLinkUrl = STORAGE_CLIENT_API + bucketName +
          '/o?prefix=';
        var fileUrl = file.kind === 'folder' ? folderSelfLinkUrl +
          encodeURIComponent(file.name) :
          STORAGE_FILE_URL + bucketName + '/' + encodeURIComponent(file.name);
        
        return fileUrl;
      };

      factory.postFileToParent = function (file) {
        var fileUrl = getFileUrl(file);
        var data = {
          params: fileUrl
        };

        if (!factory.storageFull) {
          console.log('Message posted to parent window', [fileUrl]);
          $window.parent.postMessage([fileUrl], '*');
          gadgetsApi.rpc.call('', 'rscmd_saveSettings', null, data);
        } else {
          $rootScope.$broadcast('FileSelectAction', [fileUrl]);
        }
      };

      factory.onFileSelect = function (file) {
        if (factory.fileIsFolder(file)) {
          factory.resetSelections();

          if (factory.fileIsCurrentFolder(file)) {
            var folderPath = filesFactory.folderPath.split('/');
            folderPath = folderPath.length > 2 ?
              folderPath.slice(0, -2).join('/') + '/' : '';

            filesFactory.folderPath = folderPath;
          } else {
            filesFactory.folderPath = file.name;
          }

          filesFactory.refreshFilesList();

        } else {
          if (file.isThrottled) {
            file.showThrottledCallout = true;
            // calloutClosingService.add(file);
            return;
          }

          factory.postFileToParent(file);
        }
      };

      return factory;
    }
  ]);
