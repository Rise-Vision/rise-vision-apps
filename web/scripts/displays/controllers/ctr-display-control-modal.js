'use strict';
angular.module('risevision.displays.controllers')
  .controller('DisplayControlModalCtrl', ['$scope', '$modalInstance', 
    'displayControlFactory',
    function ($scope, $modalInstance, displayControlFactory) {

      var _loadConfiguration = function() {
        displayControlFactory.getConfiguration();
      };

      _loadConfiguration();

      $scope.saveConfiguration = function () {
        displayControlFactory.updateConfiguration()
          .then(function () {
            $modalInstance.close();
          });
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
