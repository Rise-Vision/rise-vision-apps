'use strict';

angular.module('risevision.template-editor.directives')
  .constant('DEFAULT_IMAGE_THUMBNAIL',
    'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon-no-transparency%402x.png')
  .constant('SUPPORTED_IMAGE_TYPES', '.bmp, .gif, .jpeg, .jpg, .png, .svg, .webp')
  .directive('templateComponentImage', ['$log', '$q', '$timeout', 'templateEditorFactory', 'templateEditorUtils',
    'fileExistenceCheckService', 'fileMetadataUtilsService', 'DEFAULT_IMAGE_THUMBNAIL', 'SUPPORTED_IMAGE_TYPES',
    function ($log, $q, $timeout, templateEditorFactory, templateEditorUtils,
      fileExistenceCheckService, fileMetadataUtilsService, DEFAULT_IMAGE_THUMBNAIL, SUPPORTED_IMAGE_TYPES) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-image.html',
        link: function ($scope, element) {
          var storagePanelSelector = '.storage-selector-container';

          $scope.factory = templateEditorFactory;
          $scope.validExtensions = SUPPORTED_IMAGE_TYPES;

          $scope.uploadManager = {
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              _addFilesToMetadata([file]);
            }
          };
          $scope.storageManager = {
            addSelectedItems: function (newSelectedItems) {
              _addFilesToMetadata(newSelectedItems, true);

              $scope.resetPanelHeader();
              $scope.showPreviousPanel();
            },
            handleNavigation: function (folderPath) {
              var folderName = templateEditorUtils.fileNameOf(folderPath);

              if (folderName) {
                $scope.setPanelIcon('fa-folder');
                $scope.setPanelTitle(folderName);
              } else {
                $scope.setPanelIcon('riseStorage', 'riseSvg');
                $scope.setPanelTitle('Rise Storage');
              }
            }
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

            _setMetadata($scope.componentId, metadata);
          }

          function _loadSelectedImages() {
            var selectedImages = _getAttribute('metadata');

            if (selectedImages) {
              _setSelectedImages(selectedImages);
            }

            $scope.factory.loadingPresentation = true;

            var checksCompleted = $scope.fileExistenceChecksCompleted;

            if (checksCompleted && checksCompleted[$scope.componentId]) {
              $timeout(function () {
                $scope.factory.loadingPresentation = false;
              });
            }
          }

          function _loadDuration() {
            var duration = _getAttribute('duration');

            if (!duration) {
              duration = _getDefaultDurationAttribute();
            }

            duration = parseInt(duration, 10);

            // default to value 10 if duration not defined
            $scope.values.duration = (duration && !isNaN(duration)) ? duration : 10;
          }

          function _getAttribute(key) {
            return $scope.getAttributeData($scope.componentId, key);
          }

          function _setAttribute(key, value) {
            $scope.setAttributeData($scope.componentId, key, value);
          }

          function _getDefaultFilesAttribute() {
            return $scope.getBlueprintData($scope.componentId, 'files');
          }

          function _getDefaultDurationAttribute() {
            return $scope.getBlueprintData($scope.componentId, 'duration');
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

            if (componentId === $scope.componentId) {
              _setSelectedImages(selectedImages);
            }

            $scope.setAttributeData(componentId, 'metadata', selectedImages);
            $scope.setAttributeData(componentId, 'files', filesAttribute);
          }

          function _setSelectedImages(selectedImages) {
            var filesAttribute =
              fileMetadataUtilsService.filesAttributeFor(selectedImages);

            $scope.selectedImages = selectedImages;
            $scope.isDefaultImageList = filesAttribute === _getDefaultFilesAttribute();
          }

          _reset();

          $scope.saveDuration = function () {
            _setAttribute('duration', $scope.values.duration);
          };

          $scope.registerDirective({
            type: 'rise-image',
            iconType: 'streamline',
            icon: 'image',
            element: element,
            show: function () {
              element.show();

              _reset();
              $scope.componentId = $scope.factory.selected.id;

              _loadSelectedImages();
              _loadDuration();

              $scope.showNextPanel('.image-component-container');
            },
            onBackHandler: function () {
              if ($scope.getCurrentPanel() !== storagePanelSelector) {
                return $scope.showPreviousPanel();
              } else if (!$scope.storageManager.onBackHandler()) {
                $scope.setPanelIcon();
                $scope.setPanelTitle();

                return $scope.showPreviousPanel();
              } else {
                return true;
              }
            },
            onPresentationOpen: function () {
              console.log('on presentation open');
              $scope.fileExistenceChecksCompleted = {};

              var imageComponentIds = $scope.getComponentIds({
                type: 'rise-image'
              });

              _.forEach(imageComponentIds, function (componentId) {
                console.log('checking file existence for component', componentId);

                _checkFileExistenceFor(componentId)
                  .finally(function () {
                    $scope.fileExistenceChecksCompleted[componentId] = true;

                    if (componentId === $scope.componentId && $scope.factory.loadingPresentation) {
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
            $scope.showNextPanel(storagePanelSelector);
          };

          $scope.getPartialPath = function (partial) {
            return 'partials/template-editor/components/component-image/' + partial;
          };

          $scope.removeImageFromList = function (image) {
            var currentMetadata = $scope.selectedImages;
            var metadata =
              fileMetadataUtilsService.metadataWithFileRemoved(currentMetadata, image);

            if (metadata) {
              _setMetadata($scope.componentId, metadata);
            }
          };
        }
      };
    }
  ]);
