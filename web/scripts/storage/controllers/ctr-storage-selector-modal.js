'use strict';
angular.module('risevision.storage.controllers')
  .controller('StorageSelectorModalController', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {

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
