'use strict';

angular.module('risevision.template-editor.directives')
  .constant('DEFAULT_IMAGE_THUMBNAIL', 'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon%402x.png')
  .constant('SUPPORTED_IMAGE_TYPES', '.png, .jpg, .gif, .tif, .tiff')
  .directive('templateComponentImage', ['$log', 'templateEditorFactory', 'storageAPILoader', 'DEFAULT_IMAGE_THUMBNAIL',
    'SUPPORTED_IMAGE_TYPES',
    function ($log, templateEditorFactory, storageAPILoader, DEFAULT_IMAGE_THUMBNAIL, SUPPORTED_IMAGE_TYPES) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-image.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.validExtensions = SUPPORTED_IMAGE_TYPES;
          $scope.uploadManager = {
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              console.log('Added file to uploadManager', file);
              var selectedImages = $scope.isDefaultImageList ? [] : _.cloneDeep($scope.selectedImages);

              var newFile = {
                file: file.name,
                'thumbnail-url': file.metadata.thumbnail
              };
              var idx = _.findIndex(selectedImages, {
                file: file.name
              });

              if (idx >= 0) {
                selectedImages.splice(idx, 1, newFile);
              } else {
                selectedImages.push(newFile);
              }

              _setMetadata(selectedImages);
            }
          };

          function _reset() {
            _setSelectedImages([]);
            $scope.isUploading = false;
          }

          function _loadSelectedImages() {
            var selectedImages = $scope.getAttributeData($scope.componentId, 'metadata');

            if (selectedImages) {
              _setSelectedImages(selectedImages);
            } else {
              _buildSelectedImagesFromBlueprint();
            }
          }

          function _getDefaultFilesAttribute() {
            return $scope.getBlueprintData($scope.componentId, 'files');
          }

          function _buildSelectedImagesFromBlueprint() {
            $scope.factory.loadingPresentation = true;
            var files = _getDefaultFilesAttribute();

            var metadata = [];
            var fileNames = files ? files.split('|') : [];

            _buildListRecursive(metadata, fileNames);
          }

          function _getThumbnailUrlFor(fileName) {
            var regex = /risemedialibrary-([0-9a-f-]{36})[/](.+)/g;
            var match = regex.exec(fileName);

            if (!match) {
              $log.error('Filename is not a valid Rise Storage path: ' + fileName);

              return Promise.resolve(DEFAULT_IMAGE_THUMBNAIL);
            }

            return _requestFileData(match[1], match[2])
              .then(function (resp) {
                var file = resp && resp.result && resp.result.result &&
                  resp.result.files && resp.result.files[0];

                return file && file.metadata && file.metadata.thumbnail ?
                  file.metadata.thumbnail : DEFAULT_IMAGE_THUMBNAIL;
              })
              .catch(function (error) {
                $log.error(error);

                return DEFAULT_IMAGE_THUMBNAIL;
              });
          }

          function _requestFileData(companyId, file) {
            var search = {
              'companyId': companyId,
              'file': file
            };

            return storageAPILoader()
              .then(function (storageApi) {
                return storageApi.files.get(search);
              });
          }

          function _buildListRecursive(metadata, fileNames) {
            if (fileNames.length === 0) {
              _setMetadata(metadata);
              $scope.factory.loadingPresentation = false;

              return;
            }

            var fileName = fileNames.shift();

            _getThumbnailUrlFor(fileName)
              .then(function (url) {
                var entry = {
                  'file': fileName,
                  'thumbnail-url': url || ''
                };

                metadata.push(entry);
              })
              .catch(function (error) {
                $log.error(error);
              })
              .then(function () {
                _buildListRecursive(metadata, fileNames);
              });
          }

          function _filesAttributeFor(metadata) {
            return _.map(metadata, function (entry) {
              return entry.file;
            }).join('|');
          }

          function _setMetadata(metadata) {
            var selectedImages = angular.copy(metadata);
            var filesAttribute = _filesAttributeFor(selectedImages);

            _setSelectedImages(selectedImages);

            $scope.setAttributeData($scope.componentId, 'metadata', selectedImages);
            $scope.setAttributeData($scope.componentId, 'files', filesAttribute);
          }

          function _setSelectedImages(selectedImages) {
            var filesAttribute = _filesAttributeFor(selectedImages);

            $scope.selectedImages = selectedImages;
            $scope.isDefaultImageList = filesAttribute === _getDefaultFilesAttribute();
          }

          _reset();

          $scope.registerDirective({
            type: 'rise-data-image',
            icon: 'fa-image',
            element: element,
            show: function () {
              element.show();

              _reset();
              $scope.componentId = $scope.factory.selected.id;

              _loadSelectedImages();

              $scope.showNextPanel('.image-component-container');
            },
            onBackHandler: function () {
              return $scope.showPreviousPanel();
            }
          });

          $scope.fileNameOf = function (path) {
            return path.split('/').pop();
          };

          $scope.uploadImages = function () {
            $scope.showNextPanel('.upload-images-container');
          };

          $scope.selectFromStorage = function () {
            $scope.showNextPanel('.storage-selector-container');
          };

          $scope.getPartialPath = function (partial) {
            return 'partials/template-editor/components/component-image/' + partial;
          };

          $scope.removeImageFromList = function (image) {
            var idx = $scope.selectedImages.indexOf(image);
            var selectedImages = _.cloneDeep($scope.selectedImages);

            if (idx >= 0) {
              selectedImages.splice(idx, 1);
              _setMetadata(selectedImages);
            }
          };
        }
      };
    }
  ]);
