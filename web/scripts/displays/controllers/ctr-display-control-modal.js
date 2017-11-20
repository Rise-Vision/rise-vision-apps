'use strict';
angular.module('risevision.displays.controllers')
  .controller('DisplayControlModalCtrl', ['$scope', 'playerProFactory', '$modalInstance',
    function ($scope, playerProFactory, $modalInstance) {

      $scope.startTrial = function () {
        playerProFactory.saveDisplayControlConfig()
          .then(function () {
            $modalInstance.close();
          });
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
