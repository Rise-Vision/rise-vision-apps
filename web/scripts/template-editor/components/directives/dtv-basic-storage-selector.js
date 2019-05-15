'use strict';

angular.module('risevision.template-editor.directives')
  .directive('basicStorageSelector', ['storage',
    function (storage) {
      return {
        restrict: 'E',
        scope: {
          storageSelectorId: '@',
          validExtensions: '=?'
        },
        templateUrl: 'partials/template-editor/common/basic-storage-selector.html',
        link: function ($scope) {
          $scope.folderItems = [];
          $scope.selectedItems = [];
          $scope.storageUploadManager = {
            folderPath: '',
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              var idx = _.findIndex($scope.folderItems, { name: file.name });

              if (idx >= 0) {
                $scope.folderItems.splice(idx, 1, file);
              }
              else {
                $scope.folderItems.push(file);
              }
            }
          };

          $scope.isFolder = function (path) {
            return path[path.length - 1] === '/';
          };

          $scope.fileNameOf = function (path) {
            var parts = path.split('/');

            if ($scope.isFolder(path)) {
              return parts[parts.length - 2] + '/';
            }
            else {
              return parts.pop();
            }
          };

          $scope.loadItems = function (newFolderPath) {
            var folderPath = ($scope.folderPath || '') + (newFolderPath || '');

            storage.files.get({ folderPath: folderPath }).then(function (items) {
              $scope.selectedItems = [];
              $scope.storageUploadManager.folderPath = folderPath;
              $scope.folderItems = items.files.filter(function (item) {
                return item.name !== newFolderPath;
              });
            });
          };

          $scope.selectItem = function (item) {
            var idx = $scope.selectedItems.indexOf(item);

            if (idx >= 0) {
              $scope.selectedItems.splice(idx, 1);
            }
            else {
              $scope.selectedItems.push(item);
            }
          };

          $scope.isSelected = function (item) {
            return $scope.selectedItems.indexOf(item) >= 0;
          };

          $scope.loadItems();
        }
      };
    }
  ]);
