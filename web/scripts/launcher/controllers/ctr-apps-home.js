'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('AppsHomeCtrl', ['$scope', 'localStorageService', 'schedule', '$loading', 'processErrorCode',
    '$log', '$sce', 'SHARED_SCHEDULE_URL',
    function ($scope, localStorageService, schedule, $loading, processErrorCode, $log, $sce, SHARED_SCHEDULE_URL) {
      $scope.schedules = [];
      var tooltipDismissedKey = 'ShareTooltip.dismissed';
      var search = {
        sortBy: 'changeDate',
        count: 10,
        reverse: true,
      };

      $scope.showTooltipOverlay = false;

      var triggerOverlay = function () {
        $scope.showTooltipOverlay = localStorageService.get(tooltipDismissedKey) !== true;

        if ($scope.showTooltipOverlay) {
          var handler = $scope.$on('tooltipOverlay.dismissed', function () {
            localStorageService.set(tooltipDismissedKey, true);
            $scope.showTooltipOverlay = false;
            handler();
          });
        }
      };

      $scope.$watch('loadingItems', function (loading) {
        if (loading) {
          $loading.start('apps-home-loader');
        } else {
          $loading.stop('apps-home-loader');
        }
      });

      $scope.getEmbedUrl = function (scheduleId) {
        if (!scheduleId) {
          return null;
        }
        var url = SHARED_SCHEDULE_URL.replace('SCHEDULE_ID', scheduleId) + '&env=apps_home';
        return $sce.trustAsResourceUrl(url);
      };

      $scope.load = function () {
        $scope.errorMessage = '';
        $scope.apiError = '';
        $scope.loadingItems = true;

        schedule.list(search)
          .then(function (result) {
            $scope.schedules = result.items || [];
            if ($scope.schedules.length > 0) {
              $scope.selectedSchedule = $scope.schedules[0];

              triggerOverlay();
            }
          })
          .catch(function (e) {
            $scope.errorMessage = 'Failed to load Schedules.';
            $scope.apiError = processErrorCode('Schedules', 'load', e);
            $log.error($scope.errorMessage, e);
          })
          .finally(function () {
            $scope.loadingItems = false;
          });
      };

      $scope.load();
    }
  ]); //ctr
