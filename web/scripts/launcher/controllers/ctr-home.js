'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('HomeCtrl', ['$scope', 'launcherTracker', 'editorFactory',
    'localStorageService',
    function ($scope, launcherTracker, editorFactory, localStorageService) {
      $scope.launcherTracker = launcherTracker;
      $scope.editorFactory = editorFactory;
      $scope.showHelp = localStorageService.get('launcher.showHelp') ===
        'true';

      $scope.toggleHelp = function () {
        $scope.showHelp = !$scope.showHelp;
        localStorageService.set('launcher.showHelp', $scope.showHelp);
      }
    }
  ]); //ctr
