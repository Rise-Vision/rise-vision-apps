'use strict';

angular.module('risevision.schedules.controllers')
  .controller('schedulesList', ['$scope', '$loading', '$filter', 'schedule', 
    'scheduleFactory', 'ScrollingListService',
    function ($scope, $loading, $filter, schedule, scheduleFactory, ScrollingListService) {
      $scope.search = {
        sortBy: 'changeDate',
        count: $scope.listLimit,
        reverse: true,
        name: 'Schedules'
      };

      $scope.listOperations = {
        name: 'Schedule',
        operations: [{
          name: 'Delete',
          actionCall: scheduleFactory.deleteScheduleByObject,
          requireRole: 'cp'
        }]
      };
      $scope.schedules = new ScrollingListService(schedule.list, $scope.search, $scope.listOperations);

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
