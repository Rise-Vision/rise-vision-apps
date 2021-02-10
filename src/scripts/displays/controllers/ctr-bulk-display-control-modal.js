'use strict';
angular.module('risevision.displays.controllers')
  .controller('BulkDisplayControlModalCtrl', ['$scope', '$modalInstance', 'displayControlFactory',
    function ($scope, $modalInstance, displayControlFactory) {
      $scope.formData = {
        displayControlContents: displayControlFactory.getDefaultConfiguration()
      };

      $scope.saveConfiguration = function () {
        $modalInstance.close($scope.formData.displayControlContents);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      $scope.resetForm = function () {
        $scope.formData.displayControlContents = displayControlFactory.getDefaultConfiguration();
      };
    }
  ]);
