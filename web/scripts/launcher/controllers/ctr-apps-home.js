'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('AppsHomeCtrl', ['$scope', 'schedule', '$loading', 'processErrorCode',
    '$log', '$sce', 'SHARED_SCHEDULE_URL',
    function ($scope, schedule, $loading, processErrorCode, $log, $sce, SHARED_SCHEDULE_URL) {
      $scope.schedules = [];
      var search = {
        sortBy: 'changeDate',
        count: 10,
        reverse: true,
      };

      var triggerOverlay = function () {
        $scope.tooltipKey = 'ShareEnterpriseTooltip';
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
