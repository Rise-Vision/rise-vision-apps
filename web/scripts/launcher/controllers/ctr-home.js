'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('HomeCtrl', ['$scope', '$rootScope', 'launcherFactory', 'editorFactory',
    'displayFactory', '$loading', 'userState',
    function ($scope, $rootScope, launcherFactory, editorFactory, displayFactory,
      $loading, userState) {
      $scope.launcherFactory = launcherFactory;
      $scope.editorFactory = editorFactory;
      $scope.displayFactory = displayFactory;

      function loadItems() {
        if (userState.isRiseVisionUser()) {
          $loading.startGlobal('launcher.loading');

          $scope.$watchGroup([
            'launcherFactory.presentations.loadingItems',
            'launcherFactory.schedules.loadingItems',
            'launcherFactory.displays.loadingItems',
          ], function (newValues) {
            if (!newValues[0]) {
              $loading.stopGlobal('launcher.loading');
              $loading.stop('presentation-list-loader');
            }

            if (!newValues[1]) {
              $loading.stop('schedules-list-loader');
            }

            if (!newValues[2]) {
              $loading.stop('displays-list-loader');
            }
          });

          launcherFactory.load();
        }
      }

      loadItems();

      $rootScope.$on('risevision.profile.refreshed', function() {
        loadItems();
      });
    }
  ]); //ctr
