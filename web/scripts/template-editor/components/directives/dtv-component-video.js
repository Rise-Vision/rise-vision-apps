'use strict';

angular.module('risevision.template-editor.directives')
  .constant('SUPPORTED_VIDEO_TYPES', '.mp4, .webm')
  .directive('templateComponentVideo', ['$timeout', 'templateEditorFactory', 'templateEditorUtils',
    'SUPPORTED_VIDEO_TYPES',
    function ($timeout, templateEditorFactory, templateEditorUtils, SUPPORTED_VIDEO_TYPES) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-video.html',
        link: function ($scope, element) {
          var storagePanelSelector = '.video-storage-container';

          $scope.factory = templateEditorFactory;
          $scope.validExtensions = SUPPORTED_VIDEO_TYPES;
          $scope.uploadManager = {
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              // TODO: add file
              console.log('adding file', file);
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
            _setSelectedFiles([]);
            $scope.isUploading = false;
          }

          function _addFilesToMetadata(files) {
            // TODO: implement
            console.log('adding files', files);
          }

          function _loadSelectedFiles() {
            $scope.factory.loadingPresentation = true;

            // TODO: load selected files

            $timeout(function () {
              $scope.factory.loadingPresentation = false;
            });
          }

          function _setAttribute(key, value) {
            $scope.setAttributeData($scope.componentId, key, value);
          }

          function _setMetadata(metadata) {
            var selectedFiles = angular.copy(metadata);

            _setSelectedFiles(selectedFiles);

            _setAttribute('metadata', selectedFiles);
          }

          function _setSelectedFiles(selectedFiles) {
            $scope.selectedFiles = selectedFiles;
          }

          _reset();

          $scope.registerDirective({
            type: 'rise-video',
            iconType: 'streamline',
            icon: 'video',
            element: element,
            show: function () {
              element.show();

              _reset();
              $scope.componentId = $scope.factory.selected.id;

              _loadSelectedFiles();

              $scope.showNextPanel('.video-component-container');
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

          $scope.selectFromStorage = function () {
            $scope.storageManager.refresh();
            $scope.showNextPanel(storagePanelSelector);
          };

          $scope.getPartialPath = function (partial) {
            return 'partials/template-editor/components/component-video/' + partial;
          };

          $scope.removeFileFromList = function (file) {
            // TODO: remove files
            console.log('removing file', file);
          };
        }
      };
    }
  ]);
