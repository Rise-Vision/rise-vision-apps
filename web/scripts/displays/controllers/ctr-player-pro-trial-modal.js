'use strict';
angular.module('risevision.displays.controllers')
  .controller('PlayerProTrialModalCtrl', ['$scope', 'playerProFactory', 
    '$modalInstance',
    function ($scope, playerProFactory, $modalInstance) {

      $scope.startTrial = function () {
        playerProFactory.startPlayerProTrial()
          .then(function () {
            $modalInstance.close();
          });
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
