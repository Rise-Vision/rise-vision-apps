'use strict';
angular.module('risevision.storage.controllers')
  .controller('StorageSelectorModalController', ['$scope', '$modalInstance',
    'enableByURL',
    function ($scope, $modalInstance, enableByURL) {
      $scope.enableByURL = enableByURL;

      $scope.select = function (files) {
        $modalInstance.close(files);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      $scope.$on('FileSelectAction', function (event, file) {
        if (file) {
          $scope.select(file);
        }
      });

      $scope.$on('CancelFileSelect', function (event) {
        $scope.dismiss();
      });

    }
  ]);
