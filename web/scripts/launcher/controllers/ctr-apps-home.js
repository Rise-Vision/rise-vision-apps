'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('AppsHomeCtrl', ['$scope', '$filter', 'ScrollingListService', 'schedule', '$loading', '$sce',
    'SHARED_SCHEDULE_URL',
    function ($scope, $filter, ScrollingListService, schedule, $loading, $sce, SHARED_SCHEDULE_URL) {
      $scope.search = {
        sortBy: 'changeDate',
        reverse: true,
      };

      $scope.schedules = new ScrollingListService(schedule.list, $scope.search);

      $scope.filterConfig = {
        placeholder: $filter('translate')('schedules-app.list.filter.placeholder')
      };

      $scope.$watch('schedules.loadingItems', function (loading) {
        if (loading) {
          if (!$scope.selectedSchedule) {
            $loading.start('apps-home-loader');
          }
        } else {
          if (!$scope.selectedSchedule && $scope.schedules.items.list.length > 0) {
            $scope.selectedSchedule = $scope.schedules.items.list[0];
          }

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

    }
  ]); //ctr
