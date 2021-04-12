'use strict';

angular.module('risevision.template-editor.directives')
  .constant('DEFAULT_IMAGE_THUMBNAIL',
    'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon-no-transparency%402x.png')
  .constant('SUPPORTED_IMAGE_TYPES', '.bmp, .gif, .jpeg, .jpg, .png, .svg, .webp')
  .directive('templateComponentImage', ['$log', '$q', '$timeout', 'templateEditorFactory', 'templateEditorUtils',
    'fileExistenceCheckService', 'fileMetadataUtilsService', 'DEFAULT_IMAGE_THUMBNAIL', 'SUPPORTED_IMAGE_TYPES',
    'logoImageFactory', 'baseImageFactory',
    function ($log, $q, $timeout, templateEditorFactory, templateEditorUtils,
      fileExistenceCheckService, fileMetadataUtilsService, DEFAULT_IMAGE_THUMBNAIL, SUPPORTED_IMAGE_TYPES,
      logoImageFactory, baseImageFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-image.html',
        link: function ($scope, element) {
          var storagePanelSelector = {
            iconType: 'streamline',
            icon: 'folder',
            title: 'Rise Storage',
            panel: '.storage-selector-container'
          };
          var imageFactory = baseImageFactory;

          $scope.factory = templateEditorFactory;
          $scope.validExtensions = SUPPORTED_IMAGE_TYPES;

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

          var _updatePanelHeader = function () {
            if ($scope.isEditingLogo()) {
              $scope.setPanelIcon('circleStar', 'streamline');
              $scope.setPanelTitle('Logo Settings');
            } else {
              $scope.resetPanelHeader();
            }
          };

          $scope.storageManager = {
            addSelectedItems: function (newSelectedItems) {
              _addFilesToMetadata(newSelectedItems, true);

              _updatePanelHeader();

              $scope.showPreviousPage();
            },
            isSingleFileSelector: $scope.isEditingLogo,
            handleNavigation: function (folderPath) {
              var folderName = templateEditorUtils.fileNameOf(folderPath);

              if (folderName) {
                $scope.setPanelIcon('folder', 'streamline');
                $scope.setPanelTitle(folderName);
              } else {
                $scope.setPanelIcon('riseStorage', 'riseSvg');
                $scope.setPanelTitle('Rise Storage');
              }
            },
            reset: function () {
              // for override
            }
          };
          $scope.values = {};

          function _reset() {
            _setSelectedImages([]);
            $scope.isUploading = false;
            $scope.storageManager.reset();
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

            $scope.factory.loadingPresentation = true;

            if (imageFactory.areChecksCompleted($scope.fileExistenceChecksCompleted)) {
              $timeout(function () {
                $scope.factory.loadingPresentation = false;
              });
            }
          }

          function _loadDuration() {
            var duration = imageFactory.getDuration();

            if (!duration) {
              duration = _getDefaultDurationAttribute();
            }

            duration = parseInt(duration, 10);

            // default to value 10 if duration not defined
            $scope.values.duration = (duration && !isNaN(duration)) ? duration : 10;
          }

          function _loadTransition() {
            var transition = imageFactory.getTransition();
            if (!transition) {
              transition = _getBlueprint('transition');
            }
            $scope.values.transition = transition;
          }

          function _loadHelpText() {
            $scope.helpText = imageFactory.getHelpText();
          }

          function _getBlueprint(key) {
            return imageFactory.getBlueprintData(key);
          }

          function _getDefaultFilesAttribute() {
            return _getBlueprint('files');
          }

          function _getDefaultDurationAttribute() {
            return _getBlueprint('duration');
          }

          function _getFilesFor(componentId) {
            var metadata = $scope.getAttributeData(componentId, 'metadata');

            if (!metadata) {
              return $scope.getBlueprintData(componentId, 'files');
            }

            return fileMetadataUtilsService.extractFileNamesFrom(metadata);
          }

          $scope.updateFileMetadata = function (componentId, newMetadata) {
            var currentMetadata = $scope.getAttributeData(componentId, 'metadata');
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

            $scope.setAttributeData(componentId, 'metadata', selectedImages);
            $scope.setAttributeData(componentId, 'files', filesAttribute);
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
            $scope.isDefaultImageList = filesAttribute === _getDefaultFilesAttribute();
          }

          _reset();

          $scope.saveDuration = function () {
            imageFactory.setDuration($scope.values.duration);
          };

          $scope.saveTransition = function () {
            imageFactory.setTransition($scope.values.transition);
          };

          $scope.registerDirective({
            type: 'rise-image',
            iconType: 'streamline',
            icon: 'image',
            element: element,
            panel: '.image-component-container',
            show: function () {
              _reset();

              // edits branding logo if no id is provided
              if ($scope.factory.selected.id) {
                imageFactory = baseImageFactory;
                imageFactory.componentId = $scope.factory.selected.id;
              } else {
                imageFactory = logoImageFactory;
                imageFactory.componentId = null;
              }

              _loadSelectedImages();
              _loadDuration();
              _loadTransition();
              _loadHelpText();
            },
            onBackHandler: function () {
              if ($scope.getCurrentPanel() !== storagePanelSelector) {
                if ($scope.isEditingLogo()) {
                  $scope.resetPanelHeader();
                }
                return false;
              } else if (!$scope.storageManager.onBackHandler()) {
                _updatePanelHeader();

                return false;
              } else {
                return true;
              }
            },
            onPresentationOpen: function () {
              console.log('on presentation open');
              $scope.fileExistenceChecksCompleted = {};

              var imageComponentIds = $scope.getComponentIds(function (c) {
                return c.type === 'rise-image';
              });

              _.forEach(imageComponentIds, function (componentId) {
                console.log('checking file existence for component', componentId);

                _checkFileExistenceFor(componentId)
                  .finally(function () {
                    $scope.fileExistenceChecksCompleted[componentId] = true;

                    if (imageFactory.areChecksCompleted($scope.fileExistenceChecksCompleted)) {
                      $scope.factory.loadingPresentation = false;
                    }
                  });
              });
            }
          });

          $scope.waitForPresentationId = function (metadata) {
            function _checkPresentationIdOrWait() {
              var factory = $scope.factory;
              var SMALL_CHECK_INTERVAL = 100;

              if (factory.presentation && factory.presentation.id) {
                deferred.resolve(metadata);
              } else {
                $timeout(function () {
                  _checkPresentationIdOrWait();
                }, SMALL_CHECK_INTERVAL);
              }
            }

            var deferred = $q.defer();

            _checkPresentationIdOrWait();

            return deferred.promise;
          };

          function _checkFileExistenceFor(componentId) {
            var files = _getFilesFor(componentId);

            return fileExistenceCheckService.requestMetadataFor(files, DEFAULT_IMAGE_THUMBNAIL)
              .then(function (metadata) {
                return $scope.waitForPresentationId(metadata);
              })
              .then(function (metadata) {
                console.log('received metadata', metadata);

                $scope.updateFileMetadata(componentId, metadata);
              })
              .catch(function (error) {
                $log.error('Could not check file existence for: ' + componentId, error);
              });
          }

          $scope.selectFromStorage = function () {
            $scope.storageManager.refresh();
            $scope.showNextPage(storagePanelSelector);
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

        }
      };
    }
  ]);
