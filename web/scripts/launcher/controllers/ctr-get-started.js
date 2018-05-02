'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('GetStartedCtrl', ['$scope', 'localStorageService',
    function ($scope, localStorageService) {
      var localStorageKey = 'getStartedCTA.completed';
      var completed = localStorageService.get(localStorageKey) === 'true';

      $scope.currentStep = completed ? 4 : 1;

      $scope.nextStep = function () {
        $scope.currentStep++;

        if ($scope.currentStep === 4) {
          localStorageService.set(localStorageKey, 'true');
        }
      };
    }
  ]); //ctr
