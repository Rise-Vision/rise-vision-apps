'use strict';

angular.module('risevision.template-editor.directives')
  .constant('SUPPORTED_IMAGE_TYPES', '.bmp, .gif, .jpeg, .jpg, .png, .svg, .webp')
  .directive('templateComponentImage', ['$log', '$q', '$timeout', 'templateEditorFactory', 'templateEditorUtils',
    'storageAPILoader', 'DEFAULT_IMAGE_THUMBNAIL', 'SUPPORTED_IMAGE_TYPES',
    function ($log, $q, $timeout, templateEditorFactory, templateEditorUtils, storageAPILoader,
      DEFAULT_IMAGE_THUMBNAIL, SUPPORTED_IMAGE_TYPES) {
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
              _addFilesToMetadata(newSelectedItems);

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

          function _addFilesToMetadata(files) {
            var selectedImages = $scope.isDefaultImageList ? [] : _.cloneDeep($scope.selectedImages);

            files.forEach(function (file) {
              _addFileToSet(selectedImages, file);
            });

            _setMetadata(selectedImages);
          }

          function _addFileToSet(selectedImages, file) {
            var thumbnail = file.metadata && file.metadata.thumbnail ?
              file.metadata.thumbnail : DEFAULT_IMAGE_THUMBNAIL;
            var filePath = file.bucket + '/' + file.name;
            var newFile = {
              file: filePath,
              exists: true,
              'thumbnail-url': thumbnail
            };

            templateEditorUtils.addOrReplace(selectedImages, {
              file: file.name
            }, newFile);
          }

          function _loadSelectedImages() {
            var files = _getAttribute('files') || '';
            var selectedImages = _getAttribute('metadata');

            if (selectedImages) {
              _setSelectedImages(selectedImages);
            } else {
              files = _getDefaultFilesAttribute();
            }

            _buildSelectedImagesFrom(files);
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
            var defaultFiles = $scope.getBlueprintData($scope.componentId, 'files');

            if (defaultFiles) {
              // new 'files' attribute value is an Array, but generated in Blueprint as a String
              // example value "["test1.jpg", "test2.jpg"]"
              if (defaultFiles.charAt(0) === "[" && defaultFiles.charAt(defaultFiles.length-1) === "]") {
                try {
                  defaultFiles = JSON.parse("'" + defaultFiles + "'");
                } catch (err) {
                  $log.error('Invalid default files value: ' + err);
                  return null;
                }
              } else {
                // old'files' attribute value is String containing | separated values
                // example value "test1.jpg|test2.jpg"
                defaultFiles = defaultFiles.split('|');
              }
            }

            return defaultFiles;
          }

          function _getDefaultDurationAttribute() {
            return $scope.getBlueprintData($scope.componentId, 'duration');
          }

          function _buildSelectedImagesFrom(files) {
            $scope.factory.loadingPresentation = true;

            var metadata = [];
            var fileNames = [];

            if (files) {
              fileNames = !Array.isArray(files) ? files.split('|') : files;
            }

            _buildListRecursive(metadata, fileNames);
          }

          function _getThumbnailUrlFor(fileName) {
            var regex = /risemedialibrary-([0-9a-f-]{36})[/](.+)/g;
            var match = regex.exec(fileName);

            if (!match) {
              $log.error('Filename is not a valid Rise Storage path: ' + fileName);

              return $q.resolve('');
            }

            return _requestFileData(match[1], match[2])
              .then(function (resp) {
                var file = resp && resp.result && resp.result.result &&
                  resp.result.files && resp.result.files[0];

                if (!file) {
                  return '';
                }

                return file.metadata && file.metadata.thumbnail ?
                  file.metadata.thumbnail : DEFAULT_IMAGE_THUMBNAIL;
              })
              .catch(function (error) {
                $log.error(error);

                return '';
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
              return $timeout(function () {
                $scope.updateImageMetadata(metadata);
                $scope.factory.loadingPresentation = false;
              });
            }

            var fileName = fileNames.shift();

            _getThumbnailUrlFor(fileName)
              .then(function (url) {
                var entry = {
                  file: fileName,
                  exists: !!url,
                  'thumbnail-url': url
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
            });
          }

          $scope.updateImageMetadata = function (metadata) {
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
            $scope.isDefaultImageList = JSON.stringify(filesAttribute) === JSON.stringify(_getDefaultFilesAttribute());
          }

          _reset();

          $scope.saveDuration = function () {
            _setAttribute('duration', $scope.values.duration);
          };

          $scope.registerDirective({
            type: 'rise-image',
            icon: 'fa-image',
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

          $scope.fileNameOf = templateEditorUtils.fileNameOf;

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
