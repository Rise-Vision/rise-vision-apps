'use strict';

angular.module('risevision.schedules.controllers')
  .controller('schedulesList', ['$scope', '$loading', '$filter', 'schedule', 'ScrollingListService',
    function ($scope, $loading, $filter, schedule, ScrollingListService) {
      $scope.search = {
        sortBy: 'changeDate',
        count: $scope.listLimit,
        reverse: true,
        name: 'Schedules'
      };

      $scope.schedules = new ScrollingListService(schedule.list, $scope.search);

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'schedules-app.list.filter.placeholder')
      };

      $scope.$watch('schedules.loadingItems', function (loading) {
        if (loading) {
          $loading.start('schedules-list-loader');
        } else {
          $loading.stop('schedules-list-loader');
        }
      });

    }
  ]);
