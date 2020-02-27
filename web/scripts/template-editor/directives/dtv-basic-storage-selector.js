'use strict';

angular.module('risevision.template-editor.directives')
  .directive('basicStorageSelector', ['$loading', 'storage', 'templateEditorUtils',
    function ($loading, storage, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: {
          storageSelectorId: '@',
          fileType: '@',
          validExtensions: '=?',
          storageManager: '='
        },
        templateUrl: 'partials/template-editor/basic-storage-selector.html',
        link: function ($scope) {
          var spinnerId = 'storage-' + $scope.storageSelectorId + '-spinner';
          var validExtensionsList = $scope.validExtensions ? $scope.validExtensions.split(',') : [];

          $scope.folderItems = [];
          $scope.selectedItems = [];
          $scope.filterConfig = {
            placeholder: 'Search Rise Storage',
            id: 'basicStorageSearchInput'
          };
          $scope.search = {
            doSearch: function () {},
            reverse: false
          };

          $scope.storageUploadManager = {
            folderPath: '',
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              templateEditorUtils.addOrReplaceAll($scope.folderItems, {
                name: file.name
              }, file);
            }
          };
          $scope.storageManager = angular.extend($scope.storageManager, {
            refresh: function () {
              $scope.loadItems($scope.storageUploadManager.folderPath);
            },
            onBackHandler: function () {
              var parts = $scope.storageUploadManager.folderPath.split('/');

              if (parts.length === 1) {
                return false;
              } else {
                // Since paths are of the 'folder/' form, the last item is the empty string
                parts.splice(parts.length - 2, 2);
                $scope.storageUploadManager.folderPath = parts.length > 0 ? parts.join('/') + '/' : '';
                $scope.storageManager.refresh();

                return true;
              }
            },
            reset: _reset
          });

          function _reset() {
            $scope.folderItems = [];
            $scope.selectedItems = [];
            $scope.storageUploadManager.folderPath = '';
          }

          $scope.isFolder = templateEditorUtils.isFolder;

          $scope.fileNameOf = templateEditorUtils.fileNameOf;

          $scope.hasRegularFileItems = function () {
            return templateEditorUtils.hasRegularFileItems($scope.folderItems);
          };

          $scope.thumbnailFor = function (item) {
            if (item.metadata && item.metadata.thumbnail) {
              return item.metadata.thumbnail + '?_=' + (item.timeCreated && item.timeCreated.value);
            } else {
              return item.mediaLink;
            }
          };

          $scope.loadItems = function (newFolderPath) {
            $loading.start(spinnerId);
            $scope.currentFolder = $scope.fileNameOf(newFolderPath);
            $scope.storageManager.handleNavigation(newFolderPath);

            return storage.files.get({
                folderPath: newFolderPath
              })
              .then(function (items) {
                $scope.selectedItems = [];
                $scope.storageUploadManager.folderPath = newFolderPath;

                if (items.files) {
                  $scope.folderItems = items.files.filter(function (item) {
                    var isValid = templateEditorUtils.fileHasValidExtension(item.name, validExtensionsList);

                    return item.name !== newFolderPath && ($scope.isFolder(item.name) || isValid);
                  });
                } else {
                  $scope.folderItems = [];
                }
              })
              .catch(function (err) {
                console.log('Failed to load files', err);
              })
              .finally(function () {
                $loading.stop(spinnerId);
              });
          };

          $scope.selectItem = function (item) {
            if ($scope.storageManager.isSingleFileSelector && $scope.storageManager.isSingleFileSelector()) {
              if ($scope.isSelected(item)) {
                $scope.selectedItems = [];
              } else {
                $scope.selectedItems = [item];
              }
            } else {
              templateEditorUtils.addOrRemove($scope.selectedItems, {
                name: item.name
              }, item);
            }
          };

          $scope.isSelected = function (item) {
            return _.findIndex($scope.selectedItems, {
              name: item.name
            }) >= 0;
          };

          $scope.addSelected = function () {
            $scope.storageManager.addSelectedItems($scope.selectedItems);
            _reset();
          };
        }
      };
    }
  ]);
