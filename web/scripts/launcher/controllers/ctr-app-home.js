'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('AppHomeCtrl', ['$scope', 'localStorageService', 'editorFactory',
    function ($scope, localStorageService, editorFactory) {
      var tooltipDismissedKey = 'ShareTooltip.dismissed';

      $scope.editorFactory = editorFactory;

      $scope.showTooltipOverlay = localStorageService.get(tooltipDismissedKey) !== true;

      if ($scope.showTooltipOverlay) {
        var handler = $scope.$on('tooltipOverlay.dismissed', function() {
          localStorageService.set(tooltipDismissedKey, true);
          handler();
        });        
      }
    }
  ]); //ctr
