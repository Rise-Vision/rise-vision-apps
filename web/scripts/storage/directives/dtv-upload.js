(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .value('STORAGE_UPLOAD_CHUNK_SIZE', (function () {
      var GOOGLES_REQUIRED_CHUNK_MULTIPLE = 256 * 1024;
      return GOOGLES_REQUIRED_CHUNK_MULTIPLE * 4 * 25;
    }()))
    .directive('upload', ['$rootScope', '$timeout', '$translate', '$q', 'storage',
      'FileUploader', 'UploadURIService', 'STORAGE_UPLOAD_CHUNK_SIZE', 'uploadOverwriteWarning',
      function ($rootScope, $timeout, $translate, $q, storage, FileUploader,
        UploadURIService, STORAGE_UPLOAD_CHUNK_SIZE, uploadOverwriteWarning) {
        return {
          restrict: 'E',
          scope: {
            filesFactory: '='
          },
          templateUrl: 'partials/storage/upload-panel.html',
          link: function ($scope) {
            var confirmOverwriteModal;
            var videoTypesNotSupported = ['mov', 'wmv', 'm4v', 'flv', 'avi', 'ogg', 'ogv'];
            var imageTypesNotSupported = ['tiff', 'tif'];

            $scope.warnings = [];
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

            function chekFileType(fileItem) {
              var fileName = fileItem.file.name;
              var extension = fileName && fileName.split('.').pop();
              if (videoTypesNotSupported.indexOf(extension) !== -1) {
                $scope.warnings.push({
                  fileName: fileName,
                  message: 'storage-client.warning.video-not-supported'
                });
              } else if (imageTypesNotSupported.indexOf(extension) !== -1) {
                $scope.warnings.push({
                  fileName: fileName,
                  message: 'storage-client.warning.image-not-supported'
                });
              }
            }

            function dismissWarning(fileItem) {
              var warningIndex = _.findIndex($scope.warnings, function (warning) {
                return warning.fileName === fileItem.file.name;
              });
              if (warningIndex !== -1) {
                $timeout(function () {
                  $scope.warnings.splice(warningIndex);
                }, 5000);
              }
            }

            FileUploader.onAddingFiles = function () {
              uploadOverwriteWarning.resetConfirmation();
            };

            FileUploader.onAfterAddingFile = function (fileItem) {
              console.info('onAfterAddingFile', fileItem.file.name);

              if (!fileItem.isRetrying) {
                fileItem.file.name = ($scope.filesFactory.folderPath || '') + fileItem.file.name;
                chekFileType(fileItem);
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

                  uploadOverwriteWarning.checkOverwrite(resp).then(function () {
                    fileItem.url = resp.message;
                    fileItem.taskToken = resp.taskToken;
                    fileItem.encodingFileName = resp.newFileName;
                    fileItem.chunkSize =
                      STORAGE_UPLOAD_CHUNK_SIZE;
                    FileUploader.uploadItem(fileItem);
                  }).catch(function () {
                    FileUploader.removeFromQueue(fileItem);
                  });
                })
                .then(null, function (resp) {
                  console.log('getURI error', resp);
                  FileUploader.notifyErrorItem(fileItem, resp.status);
                  $scope.status.message = resp.message;
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

              dismissWarning(item);

              if (item.isCancel) {
                return;
              }

              if (!item.isSuccess) {
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
              storage.refreshFileMetadata(item.file.name)
                .then(function (file) {
                  console.log('Add file to list of available files', file);
                  $scope.filesFactory.addFile(file);
                }, function (err) {
                  console.log('Error refreshing metadata', item.file.name, err);
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
