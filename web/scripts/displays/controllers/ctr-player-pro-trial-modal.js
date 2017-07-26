'use strict';
angular.module('risevision.displays.controllers')
  .controller('PlayerProTrialModalCtrl', ['$scope', 'displayFactory', '$modalInstance',
    function ($scope, displayFactory, $modalInstance) {

      $scope.startTrial = function() {
        displayFactory.startPlayerProTrial()
        .then(function(){
          $modalInstance.close();
        });
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]); 