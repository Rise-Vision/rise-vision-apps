(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .value('STORAGE_UPLOAD_CHUNK_SIZE', (function () {  
      var GOOGLES_REQUIRED_CHUNK_MULTIPLE = 256 * 1024;  
      return GOOGLES_REQUIRED_CHUNK_MULTIPLE * 4 * 25;
    }()))
    .directive('upload', ['$rootScope', '$q', '$translate', 'storage',
      'FileUploader', 'UploadURIService', 'STORAGE_UPLOAD_CHUNK_SIZE',
      function ($rootScope, $q, $translate, storage, FileUploader,
        UploadURIService, STORAGE_UPLOAD_CHUNK_SIZE) {
        return {
          restrict: 'E',
          scope: {
            filesFactory: '='
          },
          templateUrl: 'partials/storage/upload-panel.html',
          link: function ($scope) {
            $scope.uploader = FileUploader;
            $scope.status = {};

            $scope.removeItem = function (item) {
              FileUploader.removeFromQueue(item);
            };

            $scope.activeUploadCount = function () {
              return FileUploader.queue.filter(function (file) {
                return !file.isUploaded || file.isError;
              }).length;
            };

            $scope.getErrorCount = function () {
              return FileUploader.getErrorCount();
            };

            $scope.getNotErrorCount = function () {
              return FileUploader.getNotErrorCount();
            };

            $scope.retryFailedUpload = function (file) {
              if (file.isError) {
                FileUploader.retryItem(file);
              }
            };

            $scope.retryFailedUploads = function () {
              FileUploader.queue.forEach(function (f) {
                if (f.isError) {
                  FileUploader.retryItem(f);
                }
              });
            };

            $scope.cancelAllUploads = function () {
              FileUploader.removeAll();
            };

            FileUploader.onAfterAddingFile = function (fileItem) {
              console.info('onAfterAddingFile', fileItem.file.name);

              if (!fileItem.isRetrying) {
                fileItem.file.name = ($scope.filesFactory.folderPath ||
                  '') + fileItem.file.name;
              }

              $translate('storage-client.uploading', {
                filename: fileItem.file.name
              }).then(function (msg) {
                $scope.status.message = msg;
              });

              UploadURIService.getURI(fileItem.file)
                .then(function (resp) {
                  $rootScope.$emit('refreshSubscriptionStatus',
                    'trial-available');

                  fileItem.url = resp;
                  fileItem.chunkSize =
                    STORAGE_UPLOAD_CHUNK_SIZE;
                  FileUploader.uploadItem(fileItem);
                })
                .then(null, function (resp) {
                  console.log('getURI error', resp);
                  FileUploader.notifyErrorItem(fileItem);
                  $scope.status.message = resp;
                });
            };

            FileUploader.onBeforeUploadItem = function (item) {
              $translate('storage-client.uploading', {
                filename: item.file.name
              }).then(function (msg) {
                $scope.status.message = msg;
              });
            };

            FileUploader.onCancelItem = function (item) {
              FileUploader.removeFromQueue(item);
            };

            FileUploader.onCompleteItem = function (item) {
              console.log('onCompleteItem', item);

              if (item.isCancel) {
                return;
              } else if (!item.isSuccess) {
                $translate('storage-client.error.upload-failed').then(
                  function (msg) {
                    $scope.status.message = msg;
                  });
                return;
              }

              var baseFile = {
                'name': item.file.name,
                'updated': {
                  'value': new Date().valueOf().toString()
                },
                'size': item.file.size,
                'type': item.file.type
              };

              //retrieve to generate thumbnail
              storage.files.get({
                  file: item.file.name
                })
                .then(function (resp) {
                  var file = resp && resp.files && resp.files[0] ?
                    resp.files[0] : baseFile;
                  $scope.filesFactory.addFile(file);
                }, function (err) {
                  $scope.filesFactory.addFile(baseFile);
                })
                .finally(function () {
                  FileUploader.removeFromQueue(item);
                });
            };
          }
        };
      }
    ]);
})();
