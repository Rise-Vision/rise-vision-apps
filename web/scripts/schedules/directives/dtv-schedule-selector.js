'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleSelector', ['scheduleSelectorFactory', '$timeout', '$loading',
    function (scheduleSelectorFactory, $timeout, $loading) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/schedule-selector.html',
        scope: true,
        link: function ($scope, element) {
          var tooltipElement = angular.element(element[0].querySelector('#schedule-selector'));
          $scope.factory = scheduleSelectorFactory;

          $scope.$watchGroup([
            'factory.loadingSchedules',
            'factory.nonSelectedSchedules.loadingItems'
          ], function (values) {
            if (values[0] || values[1]) {
              $loading.start('selected-schedules-spinner');
            } else {
              $loading.stop('selected-schedules-spinner');
            }
          });

          $scope.showTooltip = function ($event) {
            $timeout(function () {
              tooltipElement.trigger('show');
            });
          };

          $scope.closeTooltip = function () {
            $timeout(function () {
              tooltipElement.trigger('hide');
            });
          };

          $scope.select = function () {
            $scope.factory.select();
            $scope.closeTooltip();
          };
        }
      };
    }
  ]);
