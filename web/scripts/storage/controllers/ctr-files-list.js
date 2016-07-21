'use strict';
angular.module('risevision.storage.controllers')
  .controller('FilesListController', ['$scope', '$rootScope',
    'storageFactory', 'fileSelectorFactory', 'filesFactory',
    'FileUploader', '$loading', '$filter', '$translate', '$timeout',
    function ($scope, $rootScope, storageFactory, fileSelectorFactory,
      filesFactory, FileUploader, $loading, $filter, $translate,
      $timeout) {
      $scope.search = {
        doSearch: function () {}
      };
      $scope.storageFactory = storageFactory;
      $scope.fileSelectorFactory = fileSelectorFactory;
      $scope.filesFactory = filesFactory;
      $scope.fileUploader = FileUploader;

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

      $rootScope.$on('subscription-status:changed',
        function (e, subscriptionStatus) {
          $scope.subscriptionStatus = subscriptionStatus;
          $scope.trialAvailable =
            subscriptionStatus.statusCode === 'trial-available';
        });

      var trashLabel;
      var lastClickTime = 0;

      $scope.filesDetails = filesFactory.filesDetails;
      $scope.statusDetails = filesFactory.statusDetails;
      $scope.bucketCreationStatus = {
        code: 202
      };
      // $scope.activeFolderDownloads = DownloadService.activeFolderDownloads;

      storageFactory.folderPath = '';
      filesFactory.refreshFilesList();

      $translate('storage-client.trash').then(function (value) {
        trashLabel = value;
      });

      $scope.fileClick = function (file) {
        if (storageFactory.fileIsFolder(file)) {
          var dblClickDelay = 300;
          var currentTime = (new Date()).getTime();

          if (currentTime - lastClickTime < dblClickDelay) {
            lastClickTime = 0;

            fileSelectorFactory.changeFolder(file);
          } else {
            lastClickTime = currentTime;

            // Use a small delay to avoid selecting a folder when the intention was navigating into it
            $timeout(function () {
              var currentTime = (new Date()).getTime();

              if (lastClickTime !== 0 && currentTime - lastClickTime >=
                dblClickDelay) {
                fileSelectorFactory.onFileSelect(file);
              }
            }, dblClickDelay);
          }
        } else {
          if (file.isThrottled) {
            file.showThrottledCallout = !file.showThrottledCallout;
            // calloutClosingService.add(file);
            return;
          }

          fileSelectorFactory.onFileSelect(file);
        }
      };

      $scope.currentDecodedFolder = function () {
        return storageFactory.folderPath ?
          decodeURIComponent(storageFactory.folderPath) : undefined;
      };

      $scope.dateModifiedOrderFunction = function (file) {
        return file.updated ? file.updated.value : '';
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
        return file.size ? Number(file.size) : 0;
      };

      // Hide file list for in app selector when no files and folders exist in root
      $scope.isFileListVisible = function () {
        if (!storageFactory.storageFull && (!$scope.currentDecodedFolder() ||
            $scope.currentDecodedFolder() === '/')) {
          return $scope.filesDetails.files.filter(function (f) {
            return !storageFactory.fileIsTrash(f) &&
              !storageFactory.fileIsCurrentFolder(f);
          }).length > 0;
        } else {
          return true;
        }
      };

    }
  ]);
