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
          $scope.storageUploadManager = {
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              console.log('Added file to uploadManager', file);
            }
          };
        }
      };
    }
  ]);
