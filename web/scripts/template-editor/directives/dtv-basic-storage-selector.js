'use strict';

angular.module('risevision.template-editor.directives')
  .directive('basicStorageSelector', ['$loading', 'storage', 'templateEditorUtils',
    function ($loading, storage, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: {
          storageSelectorId: '@',
          validExtensions: '=?',
          storageManager: '='
        },
        templateUrl: 'partials/template-editor/basic-storage-selector.html',
        link: function ($scope) {
          var spinnerId = 'storage-' + $scope.storageSelectorId + '-spinner';

          $scope.folderItems = [];
          $scope.selectedItems = [];
          $scope.storageUploadManager = {
            folderPath: '',
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              templateEditorUtils.addOrReplace($scope.folderItems, {
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
            }
          });

          function _reset() {
            $scope.folderItems = [];
            $scope.selectedItems = [];
            $scope.storageUploadManager.folderPath = '';
          }

          $scope.isFolder = function (path) {
            return path[path.length - 1] === '/';
          };

          $scope.fileNameOf = function (path) {
            var parts = path.split('/');

            if ($scope.isFolder(path)) {
              return parts[parts.length - 2] + '/';
            } else {
              return parts.pop();
            }
          };

          $scope.loadItems = function (newFolderPath) {
            $loading.start(spinnerId);

            return storage.files.get({
                folderPath: newFolderPath
              })
              .then(function (items) {
                $scope.selectedItems = [];
                $scope.storageUploadManager.folderPath = newFolderPath;
                $scope.folderItems = items.files.filter(function (item) {
                  return item.name !== newFolderPath;
                });
              })
              .catch(function (err) {
                console.log('Failed to load files', err);
              })
              .finally(function () {
                $loading.stop(spinnerId);
              });
          };

          $scope.selectItem = function (item) {
            templateEditorUtils.addOrRemove($scope.selectedItems, {
              name: item.name
            }, item);
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
