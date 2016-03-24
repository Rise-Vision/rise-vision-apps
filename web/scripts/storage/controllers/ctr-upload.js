'use strict';

angular.module('risevision.storage.controllers')
  .value('STORAGE_UPLOAD_CHUNK_SIZE', (function () {  
    var GOOGLES_REQUIRED_CHUNK_MULTIPLE = 256 * 1024;  
    return GOOGLES_REQUIRED_CHUNK_MULTIPLE * 4 * 25;
  }()))

.controller('UploadController', ['$scope', '$rootScope', '$q', 'FileUploader',
  'UploadURIService', 'filesFactory', 'storageFactory',
  '$translate', 'STORAGE_UPLOAD_CHUNK_SIZE',
  function ($scope, $rootScope, $q, uploader, uriSvc, filesSvc,
    storageFactory, $translate,
    chunkSize) {
    $scope.uploader = uploader;
    $scope.status = {};
    $scope.completed = [];

    $scope.removeItem = function (item) {
      uploader.cancelItem(item);
    };

    $scope.activeUploadCount = function () {
      return uploader.queue.filter(function (file) {
        return file.isUploading;
      }).length;
    };

    $scope.getErrorCount = function () {
      return uploader.getErrorCount();
    };

    $scope.getNotErrorCount = function () {
      return uploader.getNotErrorCount();
    };

    $scope.retryFailedUploads = function () {
      uploader.queue.forEach(function (f) {
        if (f.isError) {
          uploader.retryItem(f);
        }
      });
    };

    $scope.cancelAllUploads = function () {
      uploader.removeAll();
    };

    uploader.onAfterAddingFile = function (fileItem) {
      var deferred = $q.defer();

      console.info('onAfterAddingFile', fileItem.file.name);

      if (!fileItem.isRetrying) {
        fileItem.file.name = (storageFactory.folderPath || '') + fileItem
          .file.name;
      }

      $translate('storage-client.uploading', {
        filename: fileItem.file.name
      }).then(function (msg) {
        $scope.status.message = msg;
      });

      uriSvc.getURI(fileItem.file)
        .then(function (resp) {
          $rootScope.$emit('refreshSubscriptionStatus',
            'trial-available');

          fileItem.url = resp;
          fileItem.chunkSize = chunkSize;
          uploader.uploadItem(fileItem);
        })
        .then(null, function (resp) {
          console.log('getURI error', resp);
          $scope.uploader.notifyErrorItem(fileItem);
          $scope.status.message = resp;
        })
        .finally(function () {
          deferred.resolve();
        });

      return deferred.promise;
    };

    uploader.onBeforeUploadItem = function (item) {
      $translate('storage-client.uploading', {
        filename: item.file.name
      }).then(function (msg) {
        $scope.status.message = msg;
      });
    };

    uploader.onCancelItem = function (item) {
      uploader.removeFromQueue(item);
    };

    uploader.onCompleteItem = function (item) {
      console.log('onCompleteItem', item);
      if (item.isSuccess) {
        $scope.completed.push(item.file.name);
      }

      if ($scope.activeUploadCount() === 0) {
        uriSvc.notifyGCMTargetsChanged($scope.completed).then(function (
          resp) {
          console.log('uriSvc.notifyGCMTargetsChanged', resp);
          $scope.completed = [];
        });
      }

      if (item.isCancel) {
        return;
      } else if (!item.isSuccess) {
        $translate('storage-client.upload-failed').then(function (msg) {
          $scope.status.message = msg;
        });
        return;
      }

      var file = {
        'name': item.file.name,
        'updated': {
          'value': new Date().valueOf().toString()
        },
        'size': item.file.size,
        'type': item.file.type
      };

      filesSvc.addFile(file);

      uploader.removeFromQueue(item);
    };
  }
]);
