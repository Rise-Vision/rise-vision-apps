'use strict';
angular.module('risevision.storage.services')
  .value('STORAGE_CLIENT_API', 'https://www.googleapis.com/storage/v1/b/')
  .value('STORAGE_FILE_URL', 'https://storage.googleapis.com/')
  .factory('storageUtils', ['userState', '$log', '$q', '$modal', 'currentPlanFactory',
    'STORAGE_CLIENT_API', 'STORAGE_FILE_URL',
    function (userState, $log, $q, $modal, currentPlanFactory,
      STORAGE_CLIENT_API, STORAGE_FILE_URL) {
      var factory = {};

      factory.fileIsFolder = function (file) {
        return file.name.substr(-1) === '/' || file.name === '';
      };

      factory.fileIsTrash = function (file) {
        return file.name === '--TRASH--/';
      };

      factory.fileName = function (file) {
        return file.name.substr(factory.fileParent(file).length);
      };

      factory.fileParent = function (file) {
        var idx = file.name.length - (factory.fileIsFolder(file) ? 2 : 1);

        return file.name.substr(0, file.name.lastIndexOf('/', idx) + 1);
      };

      factory.getBucketName = function () {
        return 'risemedialibrary-' + userState.getSelectedCompanyId();
      };

      factory.getFolderSelfLinkUrl = function () {
        return STORAGE_CLIENT_API + factory.getBucketName() + '/o?prefix=';
      };

      var _getFileUrl = function (file) {
        var fileUrl = file.kind === 'folder' ?
          factory.getFolderSelfLinkUrl() +
          encodeURIComponent(file.name) :
          STORAGE_FILE_URL + factory.getBucketName() + '/' +
          encodeURIComponent(file.name);

        return fileUrl;
      };

      factory.getFileUrls = function (files) {
        var fileUrls = [];

        if (files) {
          files.forEach(function (file) {
            var copyUrl = _getFileUrl(file);
            fileUrls.push(copyUrl);
          });
        }

        return fileUrls;
      };

      factory.openSelector = function (type, filter, enableByURL) {
        var deferred = $q.defer();

        var modalInstance = $modal.open({
          templateUrl: 'partials/storage/storage-modal.html',
          controller: 'StorageSelectorModalController',
          size: 'lg',
          resolve: {
            enableByURL: function () {
              return enableByURL || false;
            },
            selectorType: function () {
              return type;
            },
            selectorFilter: function () {
              return filter;
            }
          }
        });

        modalInstance.result.then(function (files) {
          console.info('Files selected: ' + files);

          deferred.resolve(files);
        }, function () {
          deferred.reject();
        });

        return deferred.promise;
      };

      factory.addFolder = function (filesFactory) {
        if (!currentPlanFactory.isPlanActive()) {
          return currentPlanFactory.showUnlockThisFeatureModal();
        }

        $modal.open({
          templateUrl: 'partials/storage/new-folder-modal.html',
          controller: 'NewFolderModalCtrl',
          resolve: {
            filesFactory: function () {
              return filesFactory;
            }
          },
          size: 'md'
        });
      };

      return factory;
    }
  ]);
