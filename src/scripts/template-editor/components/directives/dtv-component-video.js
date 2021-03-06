'use strict';

angular.module('risevision.template-editor.directives')
  .constant('DEFAULT_VIDEO_THUMBNAIL', 'streamline:video')
  .constant('SUPPORTED_VIDEO_TYPES', '.mp4, .webm')
  .directive('templateComponentVideo', ['$log', '$timeout', '$loading', 'componentsFactory', 'templateEditorFactory',
    'attributeDataFactory', 'storageManagerFactory', 'templateEditorUtils', 'fileExistenceCheckService', 
    'fileMetadataUtilsService', 'currentPlanFactory',
    'DEFAULT_VIDEO_THUMBNAIL', 'SUPPORTED_VIDEO_TYPES',
    function ($log, $timeout, $loading, componentsFactory, templateEditorFactory, attributeDataFactory, 
      storageManagerFactory, templateEditorUtils, fileExistenceCheckService, fileMetadataUtilsService,
      currentPlanFactory,
      DEFAULT_VIDEO_THUMBNAIL, SUPPORTED_VIDEO_TYPES) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-video.html',
        link: function ($scope, element) {
          $scope.templateEditorFactory = templateEditorFactory;
          $scope.validExtensions = SUPPORTED_VIDEO_TYPES;

          $scope.currentPlanFactory = currentPlanFactory;

          $scope.uploadManager = {
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              _addFilesToMetadata([file]);
            }
          };

          $scope.values = {
            volume: 0
          };

          function _reset() {
            _setSelectedFiles([]);
            $scope.isUploading = false;
          }

          function _addFilesToMetadata(files, alwaysAppend) {
            var selectedFiles = $scope.isDefaultFileList ? [] : $scope.selectedFiles;
            var metadata = fileMetadataUtilsService.metadataWithFile(selectedFiles,
              DEFAULT_VIDEO_THUMBNAIL, files, alwaysAppend);

            _setMetadata(metadata);
          }

          function _loadSelectedFiles() {
            var selectedFiles = _getAttribute('metadata');

            if (selectedFiles) {
              _setSelectedFiles(selectedFiles);
            }

            templateEditorFactory.loadingPresentation = true;

            _checkFileExistenceFor($scope.componentId)
              .finally(function () {
                $timeout(function () {
                  templateEditorFactory.loadingPresentation = false;
                });
              });
          }

          function _loadVolume() {
            var volume = _getAvailableAttribute('volume');

            // default to value 0 if volume not defined
            $scope.values.volume = templateEditorUtils.intValueFor(volume, 0);
          }

          function _getAttribute(key) {
            return attributeDataFactory.getAttributeData($scope.componentId, key);
          }

          function _setAttribute(key, value) {
            attributeDataFactory.setAttributeData($scope.componentId, key, value);
          }

          function _getAvailableAttribute(key) {
            return attributeDataFactory.getAvailableAttributeData($scope.componentId, key);
          }

          function _getBlueprintData(key) {
            return attributeDataFactory.getBlueprintData($scope.componentId, key);
          }

          function _getFilesFor(componentId) {
            var metadata = attributeDataFactory.getAttributeData(componentId, 'metadata');

            if (!metadata) {
              var files = attributeDataFactory.getAvailableAttributeData(componentId, 'files');

              return fileMetadataUtilsService.filesAttributeToArray(files);
            }

            return fileMetadataUtilsService.extractFileNamesFrom(metadata);
          }

          $scope.updateFileMetadata = function (newMetadata) {
            var currentMetadata = _getAttribute('metadata');
            var updatedMetadata =
              fileMetadataUtilsService.getUpdatedFileMetadata(currentMetadata, newMetadata);

            if (updatedMetadata) {
              _setMetadata(updatedMetadata);
            }
          };

          function _setMetadata(metadata) {
            var selectedFiles = angular.copy(metadata);

            _setSelectedFiles(selectedFiles);

            _setAttribute('metadata', selectedFiles);
          }

          function _setSelectedFiles(selectedFiles) {
            var filesAttribute =
              fileMetadataUtilsService.filesAttributeFor(selectedFiles);

            $scope.selectedFiles = selectedFiles;
            $scope.isDefaultFileList = filesAttribute === _getBlueprintData('files');
          }

          _reset();

          $scope.saveVolume = function () {
            _setAttribute('volume', $scope.values.volume);
          };

          componentsFactory.registerDirective({
            type: 'rise-video',
            element: element,
            show: function () {
              _reset();
              $scope.componentId = componentsFactory.selected.id;

              storageManagerFactory.fileType = 'video';
              storageManagerFactory.onSelectHandler = function(newSelectedItems) {
                _addFilesToMetadata(newSelectedItems, true);
              };

              _loadSelectedFiles();
              _loadVolume();
            },
            getName: function(componentId) {
              var files = _getFilesFor(componentId);

              if (files && files.length > 0) {
                return templateEditorUtils.fileNameOf(files[0]);
              } else {
                return null;
              }
            }
          });

          function _checkFileExistenceFor(componentId) {
            var files = _getFilesFor(componentId);

            return fileExistenceCheckService.requestMetadataFor(files, DEFAULT_VIDEO_THUMBNAIL)
              .then(function (metadata) {
                console.log('received metadata', metadata);

                $scope.updateFileMetadata(metadata);
              })
              .catch(function (error) {
                $log.error('Could not check file existence for: ' + componentId, error);
              });
          }

          $scope.selectFromStorage = function () {
            componentsFactory.editComponent({
              type: 'rise-storage-selector'
            });
          };

          $scope.getPartialPath = function (partial) {
            return 'partials/template-editor/components/component-video/' + partial;
          };

          $scope.removeFileFromList = function (file) {
            var currentMetadata = $scope.selectedFiles;

            var metadata =
              fileMetadataUtilsService.metadataWithFileRemoved(currentMetadata, file);

            if (metadata) {
              _setMetadata(metadata);
            }
          };

          $scope.showSettingsUI = function () {
            return $scope.selectedFiles.length > 0 && !$scope.isUploading;
          };

          $scope.sortItem = function (evt) {
            var oldIndex = evt.data.oldIndex;
            var newIndex = evt.data.newIndex;

            $scope.selectedFiles.splice(newIndex, 0, $scope.selectedFiles.splice(oldIndex, 1)[0]);
          };

          $scope.$watch('templateEditorFactory.loadingPresentation', function (loading) {
            if (loading) {
              $loading.start('video-file-loader');
            } else {
              $loading.stop('video-file-loader');
            }
          });

        }
      };
    }
  ]);
