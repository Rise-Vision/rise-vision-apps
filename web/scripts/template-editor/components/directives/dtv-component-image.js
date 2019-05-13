'use strict';

angular.module('risevision.template-editor.directives')
  .constant('SUPPORTED_IMAGE_TYPES', '.png, .jpg, .gif, .tif, .tiff')
  .directive('templateComponentImage', ['$log', 'templateEditorFactory', 'SUPPORTED_IMAGE_TYPES',
    function ($log, templateEditorFactory, SUPPORTED_IMAGE_TYPES) {
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
              var selectedImages = _.cloneDeep($scope.selectedImages);
              var newFile = { file: file.name, 'thumbnail-url': file.metadata.thumbnail };
              var idx = _.findIndex(selectedImages, { file: file.name });

              if (idx >= 0) {
                selectedImages.splice(idx, 1, newFile);
              }
              else {
                selectedImages.push(newFile);
              }

              _setMetadata(selectedImages);
            }
          };

          function _reset() {
            $scope.selectedImages = [];
            $scope.isUploading = false;
          }

          function _loadSelectedImages() {
            var selectedImages = $scope.getAttributeData($scope.componentId, 'metadata');

            if(selectedImages) {
              $scope.selectedImages = selectedImages;
            } else {
              _buildSelectedImagesFromBlueprint();
            }
          }

          function _buildSelectedImagesFromBlueprint() {
            $scope.factory.loadingPresentation = true;
            var files = $scope.getBlueprintData($scope.componentId, 'files');

            var metadata = [];
            var fileNames = files ? files.split('|') : [];

            _buildListRecursive(metadata, fileNames);
          }

          function _getThumbnailUrlFor(fileName) {
            // TODO: call service
            return Promise.resolve("http://lh3.googleusercontent.com/hOkuYaXqdtS2e4fzQGx1zqTFKko71OSDVTrOb84JsOeaUUL8hfOaLaZ5eCquqN20u_NJv_QSwMoNQl-vJ1lT");
          }

          function _buildListRecursive(metadata, fileNames) {
            if( fileNames.length === 0 ) {
              _setMetadata(metadata);
              $scope.factory.loadingPresentation = false;

              return;
            }

            var fileName = fileNames.shift();

            _getThumbnailUrlFor(fileName)
            .then( function(url) {
              var entry = {
                'file': fileName,
                'thumbnail-url': url || ''
              };

              metadata.push(entry);
            })
            .catch( function(error) {
              $log.error( error );
            })
            .then( function() {
              _buildListRecursive(metadata, fileNames);
            });
          }

          function _filesAttributeFor(metadata) {
            return _.map(metadata, function(entry) {
              return entry.file;
            }).join('|');
          }

          function _setMetadata(metadata) {
            var value = angular.copy(metadata);

            $scope.selectedImages = value;
            $scope.setAttributeData($scope.componentId, 'metadata', value);
            $scope.setAttributeData($scope.componentId, 'files', _filesAttributeFor(value));
          }

          _reset();

          $scope.registerDirective({
            type: 'rise-data-image',
            icon: 'fa-image',
            element: element,
            show: function() {
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

          $scope.fileNameOf = function( path ) {
            return path.split('/').pop();
          }

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
