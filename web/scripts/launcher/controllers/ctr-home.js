'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('HomeCtrl', ['$scope', 'launcherFactory', 'editorFactory', 
    'displayFactory', '$loading',
    function ($scope, launcherFactory, editorFactory, displayFactory, 
      $loading) {
      $scope.launcherFactory = launcherFactory;
      $scope.editorFactory = editorFactory;
      $scope.displayFactory = displayFactory;
      // $scope.showHelp = localStorageService.get('launcher.showHelp') ===
      //   'true';

      $loading.startGlobal('launcher.loading');

      $scope.$watchGroup([
        'launcherFactory.presentations.loadingItems',
        'launcherFactory.schedules.loadingItems',
        'launcherFactory.displays.loadingItems',
      ], function(newValues) {
        if (!newValues[0]) {
          $loading.stopGlobal('launcher.loading');
          $loading.stop('presentation-list-loader');
        }
        
        if (!newValues[1]) {
          $loading.stopGlobal('launcher.loading');
          $loading.stop('schedules-list-loader');
        }
        
        if (!newValues[2]) {
          $loading.stopGlobal('launcher.loading');
          $loading.stop('displays-list-loader');
        }
      });

      launcherFactory.load();
      // .then(function() {
      //   if (launcherFactory.presentations.list.length === 0 &&
      //     localStorageService.get('launcher.showHelp') === null) {
      //     localStorageService.set('launcher.showHelp', true);
      //   }        
      // });
      // 
      // $scope.toggleHelp = function () {
      //   $scope.showHelp = !$scope.showHelp;
      //   localStorageService.set('launcher.showHelp', $scope.showHelp);
      // };
    }
  ]); //ctr
