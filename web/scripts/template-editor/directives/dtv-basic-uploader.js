'use strict';

angular.module('risevision.template-editor.directives')
  .constant('ALLOWED_VALID_TYPES', ['video', 'image'])
  .directive('basicUploader', ['storage', 'fileUploaderFactory', 'UploadURIService', 'templateEditorUtils',
    'presentationUtils', 'STORAGE_UPLOAD_CHUNK_SIZE', 'ALLOWED_VALID_TYPES', 'uploadOverwriteWarning',
    function (storage, fileUploaderFactory, UploadURIService, templateEditorUtils, presentationUtils,
      STORAGE_UPLOAD_CHUNK_SIZE, ALLOWED_VALID_TYPES, uploadOverwriteWarning) {
      return {
        restrict: 'E',
        scope: {
          uploaderId: '@',
          uploadManager: '=',
          validExtensions: '=?',
          validType: '@',
        },
        templateUrl: 'partials/template-editor/basic-uploader.html',
        link: function ($scope, element) {
          var confirmOverwriteModal;
          var FileUploader = fileUploaderFactory();
          var inputElement = element.find('input');

          $scope.uploader = FileUploader;
          $scope.status = {};
          $scope.warnings = [];

          function _isUploading() {
            return $scope.activeUploadCount() > 0;
          }

          $scope.$watch($scope.uploadManager.isSingleFileSelector, function (value) {
            if (!value) {
              inputElement[0].setAttribute('multiple', true);
            } else {
              inputElement[0].removeAttribute('multiple');
            }
          });

          $scope.removeItem = function (item) {
            FileUploader.removeFromQueue(item);
            $scope.uploadManager.onUploadStatus(_isUploading());
          };

          $scope.activeUploadCount = function () {
            return FileUploader.queue.length;
          };

          $scope.retryFailedUpload = function (file) {
            if (file.isError) {
              FileUploader.retryItem(file);
            }
          };

          $scope.fileNameOf = templateEditorUtils.fileNameOf;

          $scope.uploadSelectedFiles = function (selectedFiles) {
            return $scope.uploader.removeExif(selectedFiles)
              .then($scope.uploader.compress)
              .then(function (fileItems) {
                return $scope.uploader.addToQueue(fileItems);
              });
          };

          function checkFileType(fileItem) {
            var validExtensions = $scope.validExtensions ? $scope.validExtensions.split(',') : [];

            if (!validExtensions.length) {
              return;
            }

            if (templateEditorUtils.fileHasValidExtension(fileItem.name || fileItem.file.name, validExtensions)) {
              return;
            }

            if (fileItem.file && fileItem.file.type && fileItem.file.type.indexOf('video') === 0 && fileItem
              .encodingFileName) {
              return;
            }

            if ($scope.fileTypeWarned) {
              return true;
            }
            $scope.fileTypeWarned = true;
            templateEditorUtils.showInvalidExtensionsMessage(validExtensions);
            return true;
          }

          inputElement.bind('change', function () {
            var selectedFiles = Array.from(this.files);

            $scope.uploadSelectedFiles(selectedFiles)
              .finally(function () {
                inputElement.prop('value', null);
              });
          });

          FileUploader.onAddingFiles = function () {
            uploadOverwriteWarning.resetConfirmation();
          };

          FileUploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem.file.name);

            if (!fileItem.isRetrying) {
              fileItem.file.name = ($scope.uploadManager.folderPath || '') + fileItem.file.name;
            }

            $scope.uploadManager.onUploadStatus(_isUploading());

            return UploadURIService.getURI(fileItem.file)
              .then(uploadFile)
              .then(null, function (resp) {
                console.log('getURI error', resp);

                if (resp.message === 'Unencodable overwrite') {
                  return UploadURIService.getURI(fileItem.file, true).then(uploadFile);
                }

                FileUploader.notifyErrorItem(fileItem, resp.status);
                $scope.status.message = resp.message;
              });

            function uploadFile(resp) {
              fileItem.url = resp.message;
              fileItem.taskToken = resp.taskToken;
              fileItem.encodingFileName = resp.newFileName;
              fileItem.chunkSize = STORAGE_UPLOAD_CHUNK_SIZE;

              if (checkFileType(fileItem)) {
                return FileUploader.removeFromQueue(fileItem);
              }

              return uploadOverwriteWarning.checkOverwrite(resp, true).then(function () {
                FileUploader.uploadItem(fileItem);
              }).catch(function () {
                FileUploader.removeFromQueue(fileItem);
                $scope.uploadManager.onUploadStatus(_isUploading());
              });
            }
          };

          FileUploader.currentFilePath = function () {
            return $scope.uploadManager.folderPath;
          };

          FileUploader.onBeforeUploadItem = function (item) {
            console.log('Attempting to upload', item.file.name);
          };

          FileUploader.onCancelItem = function (item) {
            FileUploader.removeFromQueue(item);
          };

          FileUploader.onCompleteItem = function (item) {
            if (item.isCancel || !item.isSuccess) {
              $scope.uploadManager.onUploadStatus(_isUploading());

              if (!item.isSuccess) {
                console.log('Failed to upload: ', item.file);
              }

              return;
            }

            var baseFile = {
              'name': item.encodingFileName || item.file.name,
              'updated': {
                'value': new Date().valueOf().toString()
              },
              'size': item.file.size,
              'type': item.file.type
            };

            // Retrieve to force thumbnail creation
            storage.refreshFileMetadata(item.encodingFileName || item.file.name)
              .then(function (file) {
                console.log('Add file to list of available files', file);
                $scope.uploadManager.addFile(file);
              }, function (err) {
                console.log('Error refreshing metadata', item.file.name, err);
                $scope.uploadManager.addFile(baseFile);
              })
              .finally(function () {
                FileUploader.removeFromQueue(item);
                $scope.uploadManager.onUploadStatus(_isUploading());
              });
          };

          $scope.setAcceptAttribute = function () {
            if (presentationUtils.isMobileBrowser() && _.includes(ALLOWED_VALID_TYPES, $scope.validType)) {
              $scope.accept = $scope.validType + '/*';
            } else {
              $scope.accept = ($scope.validExtensions && $scope.validExtensions.indexOf('mp4') >= 0) ? '*' :
                $scope.validExtensions;
            }
          };

          $scope.setAcceptAttribute();
        }
      };
    }
  ]);
