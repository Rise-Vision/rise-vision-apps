'use strict';

angular.module('risevision.schedules.controllers')
  .controller('schedulesList', ['$scope', '$log', '$location', '$loading', '$filter',
    'userState', 'schedule', 'BaseList', 'scheduleTracker', 'processErrorCode',
    function ($scope, $log, $location, $loading, $filter, userState, schedule, BaseList,
      scheduleTracker, processErrorCode) {
      var DB_MAX_COUNT = 40; //number of records to load at a time

      $scope.scheduleTracker = scheduleTracker;
      $scope.schedules = new BaseList(DB_MAX_COUNT);

      $scope.search = angular.extend({
        sortBy: 'changeDate',
        count: $scope.listLimit || DB_MAX_COUNT,
        reverse: true,
      }, $location.search());

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'schedules-app.list.filter.placeholder')
      };

      $scope.$watch('loadingSchedules', function (loading) {
        if (loading) {
          $loading.start('schedules-list-loader');
        } else {
          $loading.stop('schedules-list-loader');
        }
      });

      $scope.load = function () {
        $scope.errorMessage = '';
        $scope.apiError = '';

        if (!$scope.schedules.list.length || !$scope.schedules.endOfList &&
          $scope.schedules.cursor) {
          $scope.loadingSchedules = true;

          schedule.list($scope.search, $scope.schedules.cursor)
            .then(function (result) {
              $scope.schedules.add(result.items ? result.items : [],
                result.cursor);
            })
            .then(null, function (e) {
              $scope.errorMessage = $filter('translate')('schedules-app.list.error');
              $scope.apiError = processErrorCode('Schedules', 'load', e);

              $log.error($scope.errorMessage, e);
            })
            .finally(function () {
              $scope.loadingSchedules = false;
            });
        }
      };

      $scope.load();

      $scope.sortBy = function (cat) {
        $scope.schedules.clear();

        if (cat !== $scope.search.sortBy) {
          $scope.search.sortBy = cat;
        } else {
          $scope.search.reverse = !$scope.search.reverse;
        }

        $scope.load();
      };

      $scope.doSearch = function () {
        $scope.schedules.clear();

        $scope.load();
      };

    }
  ]);
