'use strict';

angular.module('risevision.template-editor.directives')
  .constant('DEFAULT_IMAGE_THUMBNAIL',
    'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon-no-transparency%402x.png')
  .constant('SUPPORTED_IMAGE_TYPES', '.bmp, .gif, .jpeg, .jpg, .png, .svg, .webp')
  .directive('templateComponentImage', ['$log', '$timeout', 'templateEditorFactory', 'templateEditorUtils',
    'fileExistenceCheckService', 'fileMetadataUtilsService', 'DEFAULT_IMAGE_THUMBNAIL', 'SUPPORTED_IMAGE_TYPES',
    function ($log, $timeout, templateEditorFactory, templateEditorUtils,
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
            var selectedImages = $scope.isDefaultImageList ? [] : _.cloneDeep($scope.selectedImages);

            files.forEach(function (file) {
              _addFileToSet(selectedImages, file, alwaysAppend);
            });

            _setMetadata(selectedImages);
          }

          function _addFileToSet(selectedImages, file, alwaysAppend) {
            console.log('_addFileToSet', selectedImages, file);

            var filePath = file.bucket + '/' + file.name;
            var initialLength = selectedImages.length;
            var timeCreated = fileMetadataUtilsService.timeCreatedFor(file);
            var thumbnail = fileMetadataUtilsService.thumbnailFor(file, DEFAULT_IMAGE_THUMBNAIL);

            var newFile = {
              file: filePath,
              exists: true,
              'time-created': timeCreated,
              'thumbnail-url': thumbnail
            };

            templateEditorUtils.addOrReplaceAll(selectedImages, {
              file: filePath
            }, newFile);

            if (alwaysAppend && initialLength === selectedImages.length) {
              selectedImages.push(newFile);
            }
          }

          function _loadSelectedImages() {
            var selectedImages = _getAttribute('metadata');

            if (selectedImages) {
              _setSelectedImages(selectedImages);
            }

            $scope.factory.loadingPresentation = true;

            _checkFileExistenceFor($scope.componentId)
              .finally(function () {
                $scope.factory.loadingPresentation = false;
              });
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

          function _extractFileNamesFrom(metadata) {
            return _.map(metadata, function (entry) {
              return entry.file;
            });
          }

          function _getFilesFor(componentId) {
            var metadata = $scope.getAttributeData(componentId, 'metadata');

            if (!metadata) {
              return $scope.getBlueprintData(componentId, 'files');
            }

            return _extractFileNamesFrom(metadata);
          }

          function _filesAttributeFor(metadata) {
            return _extractFileNamesFrom(metadata).join('|');
          }

          $scope.updateFileMetadata = function (metadata) {
            var currentMetadata = _getAttribute('metadata');

            if (!currentMetadata) {
              _setMetadata(metadata);
            } else {
              var atLeastOneOriginalEntryIsStillSelected = false;
              var metadataCopy = angular.copy(currentMetadata);

              _.each(metadata, function (entry) {
                var currentEntry = _.find(metadataCopy, {
                  file: entry.file
                });

                if (currentEntry) {
                  atLeastOneOriginalEntryIsStillSelected = true;
                  currentEntry.exists = entry.exists;
                  currentEntry['thumbnail-url'] = entry['thumbnail-url'];
                }
              });

              if (atLeastOneOriginalEntryIsStillSelected) {
                _setMetadata(metadataCopy);
              }
            }
          };

          function _setMetadata(metadata) {
            var selectedImages = angular.copy(metadata);
            var filesAttribute = _filesAttributeFor(selectedImages);

            _setSelectedImages(selectedImages);

            _setAttribute('metadata', selectedImages);
            _setAttribute('files', filesAttribute);
          }

          function _setSelectedImages(selectedImages) {
            var filesAttribute = _filesAttributeFor(selectedImages);

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
            }
          });

          function _checkFileExistenceFor(componentId) {
            var files = _getFilesFor(componentId);

            return fileExistenceCheckService.requestMetadataFor(files, DEFAULT_IMAGE_THUMBNAIL)
              .then(function (metadata) {
                console.log('received metadata', metadata);

                $scope.updateFileMetadata(metadata);
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
