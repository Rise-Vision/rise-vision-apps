'use strict';
angular.module('risevision.storage.controllers')
  .controller('StorageSelectorModalController', ['$scope',
    'fileSelectorFactory', 'filesFactory', '$modalInstance', '$loading',
    '$filter', '$translate', '$timeout', 'SELECTOR_TYPE', 'SELECTOR_TYPES',
    function ($scope, fileSelectorFactory, filesFactory, $modalInstance,
      $loading, $filter, $translate, $timeout, SELECTOR_TYPE, 
      SELECTOR_TYPES) {
      $scope.search = {
        doSearch: function () {}
      };
      $scope.filesFactory = filesFactory;
      $scope.fileSelectorFactory = fileSelectorFactory;

      fileSelectorFactory.type = filesFactory.type = SELECTOR_TYPE;
      filesFactory.folderPath = undefined;

      $scope.filterConfig = {
        placeholder: 'Search for files or folders',
        id: 'storageSelectorSearchInput'
      };

      $scope.$watch('filesFactory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('storage-selector-loader');
        } else {
          $loading.stop('storage-selector-loader');
        }
      });

      $scope.select = function (files) {
        $modalInstance.close(files);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      var trashLabel;
      var lastClickTime = 0;

      $scope.filesDetails = filesFactory.filesDetails;
      $scope.statusDetails = filesFactory.statusDetails;
      $scope.bucketCreationStatus = {
        code: 202
      };
      // $scope.activeFolderDownloads = DownloadService.activeFolderDownloads;

      $scope.selectorType = SELECTOR_TYPE;
      $scope.singleFileSelector = SELECTOR_TYPE === SELECTOR_TYPES.SINGLE_FILE;
      $scope.multipleFileSelector = 
        SELECTOR_TYPE === SELECTOR_TYPES.MULTIPLE_FILE;
      $scope.singleFolderSelector = 
        SELECTOR_TYPE === SELECTOR_TYPES.SINGLE_FOLDER;

      filesFactory.refreshFilesList();

      $translate('storage-client.trash').then(function (value) {
        trashLabel = value;
      });

      $scope.$on('FileSelectAction', function (event, file) {
        if (file) {
          $scope.select(file);
        }
      });
      
      $scope.fileClick = function (file) {
        if (fileSelectorFactory.fileIsFolder(file)) {
          var dblClickDelay = 300;
          var currentTime = (new Date()).getTime();

          if (currentTime - lastClickTime < dblClickDelay) {
            lastClickTime = 0;

            if (fileSelectorFactory.fileIsFolder(file)) {
              fileSelectorFactory.onFileSelect(file);
            }
          } else {
            lastClickTime = currentTime;

            // Use a small delay to avoid selecting a folder when the intention was navigating into it
            $timeout(function () {
              var currentTime = (new Date()).getTime();

              if (lastClickTime !== 0 && currentTime - lastClickTime >=
                dblClickDelay && !file.currentFolder && 
                !fileSelectorFactory.fileIsTrash(file)) {
                fileSelectorFactory.folderSelect(file);
              }
            }, dblClickDelay);
          }
        } else {
          if (fileSelectorFactory.isSingleFileSelector()) {
            fileSelectorFactory.onFileSelect(file);
          } else {
            fileSelectorFactory.fileCheckToggled(file);
          }
        }
      };

      $scope.currentDecodedFolder = function () {
        return filesFactory.folderPath ?
          decodeURIComponent(filesFactory.folderPath) : undefined;
      };

      $scope.dateModifiedOrderFunction = function (file) {
        return file.updated ? file.updated.value : '';
      };

      $scope.isTrashFolder = function () {
        return filesFactory.folderPath === '--TRASH--/';
      };

      $scope.fileNameOrderFunction = function (file) {
        return file.name.replace('--TRASH--/', trashLabel).toLowerCase();
      };

      $scope.orderByAttribute = $scope.fileNameOrderFunction;

      $scope.fileExtOrderFunction = function (file) {
        return file.name.substr(-1) === '/' ?
          'Folder' :
          (file.name.split('.').pop() === file.name) ? '' : file.name.split(
            '.').pop();
      };

      $scope.fileSizeOrderFunction = function (file) {
        return Number(file.size);
      };

      // Hide file list for in app selector when no files and folders exist in root
      $scope.isFileListVisible = function () {
        if (!fileSelectorFactory.storageFull && (!$scope.currentDecodedFolder() ||
            $scope.currentDecodedFolder() === '/')) {
          return $scope.filesDetails.files.filter(function (f) {
            return !fileSelectorFactory.fileIsTrash(f) && 
            !fileSelectorFactory.fileIsCurrentFolder(f);
          }).length > 0;
        } else {
          return true;
        }
      };

      // $scope.cancelFolderDownload = function(folder)  {
      //   DownloadService.cancelFolderDownload(folder);
      // };

    }
  ]);
