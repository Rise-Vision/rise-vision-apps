'use strict';
angular.module('risevision.storage.controllers')
  .controller('FilesListController', ['$scope', '$rootScope',
    'StorageFactory', 'FilesFactory', 'storageUtils',
    'FileUploader', '$loading', '$filter', '$translate', '$timeout',
    function ($scope, $rootScope, StorageFactory,
      FilesFactory, storageUtils, FileUploader, $loading, $filter, $translate,
      $timeout) {
      $scope.search = {
        doSearch: function () {}
      };
      var storageFactory = new StorageFactory();
      var filesFactory = new FilesFactory(storageFactory);

      $scope.storageFactory = storageFactory;
      $scope.filesFactory = filesFactory;
      $scope.storageUtils = storageUtils;
      $scope.fileUploader = FileUploader;
      $scope.isListView = false;

      $scope.setSelectorType = function (type, filter) {
        storageFactory.setSelectorType(type, filter);
        // if the init function is called, we're NOT in full mode
        storageFactory.storageFull = false;
      };

      $scope.toggleListView = function () {
        $scope.isListView = !$scope.isListView;
      };

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
      $scope.bucketCreationStatus = {
        code: 202
      };
      // $scope.activeFolderDownloads = DownloadService.activeFolderDownloads;

      filesFactory.folderPath = '';
      filesFactory.refreshFilesList();

      $translate('storage-client.trash').then(function (value) {
        trashLabel = value;
      });

      $scope.fileClick = function (file) {
        if (storageUtils.fileIsFolder(file)) {
          var dblClickDelay = 300;
          var currentTime = (new Date()).getTime();

          if (currentTime - lastClickTime < dblClickDelay) {
            lastClickTime = 0;

            filesFactory.changeFolder(file);
          } else {
            lastClickTime = currentTime;

            // Use a small delay to avoid selecting a folder when the intention was navigating into it
            $timeout(function () {
              var currentTime = (new Date()).getTime();

              if (lastClickTime !== 0 && currentTime - lastClickTime >=
                dblClickDelay) {
                filesFactory.onFileSelect(file);
              }
            }, dblClickDelay);
          }
        } else {
          if (file.isThrottled) {
            file.showThrottledCallout = !file.showThrottledCallout;
            // calloutClosingService.add(file);
            return;
          }

          filesFactory.onFileSelect(file);
        }
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

      $scope.isFileListVisible = function () {
        return !(filesFactory.loadingItems ||
          $scope.filesDetails.code === 202 || $scope.trialAvailable ||
          $scope.isEmptyState());
      };

      $scope.isEmptyState = function () {
        return !filesFactory.folderPath &&
          filesFactory.folderPath !== '/' &&
          $scope.fileUploader.queue.length === 0 &&
          $scope.filesDetails.files.filter(function (f) {
            return !storageUtils.fileIsTrash(f);
          }).length === 0;
      };

    }
  ]);
