'use strict';

angular.module('risevision.storage.controllers')
  .controller('FolderSelectorModalController', ['$scope', '$modalInstance',
    'excludedFiles',
    function ($scope, $modalInstance, excludedFiles) {
      $scope.selectorType = 'single-folder';
      $scope.selectorFilter = 'folders';
      $scope.excludedFiles = excludedFiles;

      var _select = function (files) {
        $modalInstance.close(files);
      };

      $scope.$on('FileSelectAction', function (event, files) {
        if (files) {
          _select(files);
        }
      });

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]);
