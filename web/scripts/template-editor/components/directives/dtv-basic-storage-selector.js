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
          $scope.folderItems = [{
            name: 'test1.jpg'
          }, {
            name: 'test2.jpg'
          }, {
            name: 'test3.jpg'
          }];
          $scope.storageUploadManager = {
            folderPath: '',
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              console.log('Added file to uploadManager', file);
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

          $scope.loadItems = function (folderPath) {
            storage.files.get({ folderPath: folderPath }).then(function (items) {
              $scope.folderItems = items.files.filter(function (item) {
                return item.name !== folderPath;
              });
            });
          };

          $scope.loadItems();
        }
      };
    }
  ]);
