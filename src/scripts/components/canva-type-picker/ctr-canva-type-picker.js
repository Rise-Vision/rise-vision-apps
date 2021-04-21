'use strict';

angular.module('risevision.common.components.canva-type-picker', [
    'risevision.common.components.canva-type-picker.services'
  ])
  .controller('canvaTypePickerController', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {
      $scope.designType = 'Flyer';

      $scope.ok = function () {
        $modalInstance.close($scope.designType);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
