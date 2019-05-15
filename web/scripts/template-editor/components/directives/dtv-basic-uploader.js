'use strict';

angular.module('risevision.template-editor.directives')
  .directive('basicUploader', ['storage', 'fileUploaderFactory', 'UploadURIService', 'STORAGE_UPLOAD_CHUNK_SIZE',
    function (storage, fileUploaderFactory, UploadURIService, STORAGE_UPLOAD_CHUNK_SIZE) {
      return {
        restrict: 'E',
        scope: {
          uploaderId: '@',
          uploadManager: '=',
          validExtensions: '=?'
        },
        templateUrl: 'partials/template-editor/common/basic-uploader.html',
        link: function ($scope) {
          var FileUploader = fileUploaderFactory();

          $scope.uploader = FileUploader;
          $scope.status = {};

          function _isUploading() {
            return $scope.activeUploadCount() > 0;
          }

          $scope.removeItem = function (item) {
            FileUploader.removeFromQueue(item);
          };

          $scope.activeUploadCount = function () {
            return FileUploader.queue.filter(function (file) {
              return !file.isUploaded || file.isError;
            }).length;
          };

          $scope.retryFailedUpload = function (file) {
            if (file.isError) {
              FileUploader.retryItem(file);
            }
          };

          FileUploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem.file.name);

            if (!fileItem.isRetrying) {
              fileItem.file.name = ($scope.uploadManager.folderPath || '') + fileItem.file.name;
            }

            $scope.uploadManager.onUploadStatus(_isUploading());

            UploadURIService.getURI(fileItem.file)
              .then(function (resp) {
                fileItem.url = resp;
                fileItem.chunkSize = STORAGE_UPLOAD_CHUNK_SIZE;
                FileUploader.uploadItem(fileItem);
              })
              .then(null, function (resp) {
                console.log('getURI error', resp);
                FileUploader.notifyErrorItem(fileItem);
                $scope.status.message = resp;
              });
          };

          FileUploader.onBeforeUploadItem = function (item) {
            console.log('Attempting to upload', item.file.name);
          };

          FileUploader.onCancelItem = function (item) {
            FileUploader.removeFromQueue(item);
          };

          FileUploader.onCompleteItem = function (item) {
            $scope.uploadManager.onUploadStatus(_isUploading());

            if (item.isCancel) {
              return;
            }

            if (!item.isSuccess) {
              console.log('Failed to upload: ', item.file);
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

            // Retrieve to force thumbnail creation
            storage.files.get({
                file: item.file.name
              })
              .then(function (resp) {
                var file = resp && resp.files && resp.files[0] ? resp.files[0] : baseFile;
                console.log('Add file to list of available files', file);
                $scope.uploadManager.addFile(file);
              }, function (err) {
                console.log('Failed to upload', item.file.name, err);
                $scope.uploadManager.addFile(baseFile);
              })
              .finally(function () {
                FileUploader.removeFromQueue(item);
                $scope.uploadManager.onUploadStatus(_isUploading());
              });
          };
        }
      };
    }
  ]);
