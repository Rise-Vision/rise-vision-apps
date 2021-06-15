'use strict';

angular.module('risevision.template-editor.directives')
  .constant('DEFAULT_IMAGE_THUMBNAIL',
    'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon-no-transparency%402x.png')
  .constant('SUPPORTED_IMAGE_TYPES', '.bmp, .gif, .jpeg, .jpg, .png, .svg, .webp')
  .constant('CANVA_FOLDER', 'canva/')
  .directive('templateComponentImage', ['$log', '$timeout', '$loading', 'componentsFactory', 'templateEditorFactory',
    'attributeDataFactory', 'storageManagerFactory', 'fileExistenceCheckService', 'fileMetadataUtilsService',
    'logoImageFactory', 'baseImageFactory', 'fileDownloader', 'templateEditorUtils', 
    '$rootScope', 'currentPlanFactory',
    'DEFAULT_IMAGE_THUMBNAIL', 'SUPPORTED_IMAGE_TYPES', 'CANVA_FOLDER',
    function ($log, $timeout, $loading, componentsFactory, templateEditorFactory, attributeDataFactory,
      storageManagerFactory, fileExistenceCheckService, fileMetadataUtilsService,
      logoImageFactory, baseImageFactory, fileDownloader, templateEditorUtils,
      $rootScope, currentPlanFactory,
      DEFAULT_IMAGE_THUMBNAIL, SUPPORTED_IMAGE_TYPES, CANVA_FOLDER) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-image.html',
        link: function ($scope, element) {
          var imageFactory = baseImageFactory;

          $scope.templateEditorFactory = templateEditorFactory;
          $scope.validExtensions = SUPPORTED_IMAGE_TYPES;

          $scope.currentPlanFactory = currentPlanFactory;
          $scope.isPlanActive = currentPlanFactory.isPlanActive();

          $rootScope.$on('risevision.plan.loaded', function () {
            $scope.isPlanActive = currentPlanFactory.isPlanActive();
          });

          $scope.isEditingLogo = function () {
            return imageFactory === logoImageFactory;
          };

          $scope.uploadManager = {
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              _addFilesToMetadata([file]);
            },
            isSingleFileSelector: $scope.isEditingLogo
          };

          $scope.values = {};

          function _reset() {
            _setSelectedImages([]);
            $scope.isUploading = false;
          }

          function _addFilesToMetadata(files, alwaysAppend) {
            var selectedFiles = $scope.isDefaultImageList ? [] : $scope.selectedImages;
            var metadata = fileMetadataUtilsService.metadataWithFile(selectedFiles,
              DEFAULT_IMAGE_THUMBNAIL, files, alwaysAppend);

            metadata = imageFactory.updateMetadata(metadata);

            _setSelectedImages(metadata);

          }

          function _loadSelectedImages() {
            var selectedImages = imageFactory.getImagesAsMetadata();

            if (selectedImages) {
              _setSelectedImages(selectedImages);
            }

            templateEditorFactory.loadingPresentation = true;

            if (imageFactory.componentId && !baseImageFactory.checksCompleted.hasOwnProperty([imageFactory.componentId])) {
              _checkFileExistenceFor(imageFactory.componentId)
                .finally(function() {
                  templateEditorFactory.loadingPresentation = false;
                });              
            } else if (imageFactory.areChecksCompleted()) {
              $timeout(function () {
                templateEditorFactory.loadingPresentation = false;
              });
            }
          }

          function _getFilesFor(componentId) {
            var metadata = attributeDataFactory.getAttributeData(componentId, 'metadata');

            if (!metadata) {
              var files = attributeDataFactory.getAvailableAttributeData(componentId, 'files');

              return fileMetadataUtilsService.filesAttributeToArray(files);
            }

            return fileMetadataUtilsService.extractFileNamesFrom(metadata);
          }

          $scope.updateFileMetadata = function (componentId, newMetadata) {
            var currentMetadata = attributeDataFactory.getAttributeData(componentId, 'metadata');
            var updatedMetadata =
              fileMetadataUtilsService.getUpdatedFileMetadata(currentMetadata, newMetadata);

            if (updatedMetadata) {
              _setMetadata(componentId, updatedMetadata);
            }
          };

          function _setMetadata(componentId, metadata) {
            var selectedImages = angular.copy(metadata);
            var filesAttribute =
              fileMetadataUtilsService.filesAttributeFor(selectedImages);

            if (componentId === imageFactory.componentId) {
              _setSelectedImages(selectedImages);
            }

            attributeDataFactory.setAttributeData(componentId, 'metadata', selectedImages);
            attributeDataFactory.setAttributeData(componentId, 'files', filesAttribute);
          }

          function _setSelectedImages(selectedImages) {
            var filesAttribute =
              fileMetadataUtilsService.filesAttributeFor(selectedImages);

            // Show logo in the image list if component is set to use logo and a logo is available 
            var logoAsMetadata = logoImageFactory.getImagesAsMetadata();
            if (!$scope.isEditingLogo() && imageFactory.isSetAsLogo() && logoAsMetadata.length > 0) {
              selectedImages = logoAsMetadata;
            }

            $scope.selectedImages = selectedImages;
            $scope.isDefaultImageList = filesAttribute === imageFactory.getBlueprintData('files');
          }

          _reset();

          $scope.saveDuration = function () {
            imageFactory.setDuration($scope.values.duration);
          };

          $scope.saveTransition = function () {
            imageFactory.setTransition($scope.values.transition);
          };

          var _init = function() {
            _reset();

            storageManagerFactory.fileType = 'image';
            storageManagerFactory.isSingleFileSelector = $scope.isEditingLogo;
            storageManagerFactory.onSelectHandler = function(newSelectedItems) {
              _addFilesToMetadata(newSelectedItems, true);
            };

            _loadSelectedImages();

            var duration = imageFactory.getAvailableAttributeData('duration');

            // default to value 10 if duration not defined
            $scope.values.duration = templateEditorUtils.intValueFor(duration, 10);

            $scope.values.transition = imageFactory.getAvailableAttributeData('transition');
            $scope.helpText = imageFactory.getHelpText();
          };

          var componentDirective = {
            type: 'rise-image',
            element: element,
            show: function () {
              imageFactory = baseImageFactory;
              imageFactory.componentId = componentsFactory.selected.id;

              _init();
            },
            onPresentationOpen: function () {
              baseImageFactory.componentId = null;
              baseImageFactory.checksCompleted = {};

              var imageComponentIds = attributeDataFactory.getComponentIds({
                type: 'rise-image'
              });

              _.forEach(imageComponentIds, function (componentId) {
                $log.info('checking file existence for component', componentId);

                _checkFileExistenceFor(componentId)
                  .finally(function () {
                    if (imageFactory.areChecksCompleted()) {
                      templateEditorFactory.loadingPresentation = false;
                    }
                  });
              });
            },
            getName: function(componentId) {
              var files = _getFilesFor(componentId);

              if (files && files.length > 0) {
                return templateEditorUtils.fileNameOf(files[0]);
              } else {
                return null;
              }
            }
          };

          var logoDirective = {
            type: 'rise-image-logo',
            element: element,
            show: function () {
              imageFactory = logoImageFactory;
              imageFactory.componentId = null;

              _init();
            }
          };

          componentsFactory.registerDirective(componentDirective);
          componentsFactory.registerDirective(logoDirective);

          function _checkFileExistenceFor(componentId) {
            var files = _getFilesFor(componentId);
            baseImageFactory.checksCompleted[componentId] = false;

            return fileExistenceCheckService.requestMetadataFor(files, DEFAULT_IMAGE_THUMBNAIL)
              .then(function (metadata) {
                $log.info('received metadata', metadata);

                $scope.updateFileMetadata(componentId, metadata);
              })
              .catch(function (error) {
                $log.error('Could not check file existence for: ' + componentId, error);
              })
              .finally(function() {
                baseImageFactory.checksCompleted[componentId] = true;
              });
          }

          $scope.onDesignPublished = function(options) {
            $log.info('Canva result:', options);
            var filepath = CANVA_FOLDER;
            filepath += options.designTitle? options.designTitle + '_' : '';
            filepath += options.designId + '.png';
            fileDownloader(options.exportUrl, filepath)
            .then(function(file) {
              $scope.canvaUploadList = [file];
            })
            .catch(function(err) {
              $log.error('Could not import Canva design.', err);
            });
          };

          $scope.selectFromStorage = function () {
            componentsFactory.editComponent({
              type: 'rise-storage-selector'
            });
          };

          $scope.getPartialPath = function (partial) {
            return 'partials/template-editor/components/component-image/' + partial;
          };

          $scope.removeImageFromList = function (image) {
            imageFactory.removeImage(image, $scope.selectedImages).then(function (updatedMetadata) {
              _setSelectedImages(updatedMetadata);
            });
          };

          $scope.sortItem = function (evt) {
            var oldIndex = evt.data.oldIndex;
            var newIndex = evt.data.newIndex;

            $scope.selectedImages.splice(newIndex, 0, $scope.selectedImages.splice(oldIndex, 1)[0]);
          };

          $scope.$watch('templateEditorFactory.loadingPresentation', function (loading) {
            if (loading) {
              $loading.start('image-file-loader');
            } else {
              $loading.stop('image-file-loader');
            }
          });

        }
      };
    }
  ]);
