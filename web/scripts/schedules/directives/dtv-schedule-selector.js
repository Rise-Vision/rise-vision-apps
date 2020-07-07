'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleSelector', ['scheduleSelectorFactory', '$timeout', '$loading',
    function (scheduleSelectorFactory, $timeout, $loading) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/schedule-selector.html',
        scope: {
          showTooltip: '=',
          additionalTooltipClass: '@'
        },
        link: function ($scope, element) {
          var tooltipElement = angular.element(element[0].querySelector('#schedule-selector'));
          $scope.showTooltip = false;
          $scope.factory = scheduleSelectorFactory;
          $scope.filterConfig = {
            placeholder: 'Search schedules'
          };

          $scope.$watchGroup([
            'factory.loadingSchedules',
            'factory.unselectedSchedules.loadingItems'
          ], function (values) {
            if (values[0] || values[1]) {
              $loading.start('selected-schedules-spinner');
            } else {
              $loading.stop('selected-schedules-spinner');
            }
          });

          $scope.$watch('showTooltip', function() {
            if ($scope.showTooltip) {
              $timeout(function () {
                tooltipElement.trigger('show');

                $scope.factory.load();
              });
            } else {
              $timeout(function () {
                tooltipElement.trigger('hide');
              });
            }
          });

          $scope.toggleTooltip = function ($event) {
            $scope.showTooltip = !$scope.showTooltip;
          };

          $scope.select = function () {
            $scope.factory.select();
            $scope.toggleTooltip();
          };
        }
      };
    }
  ]);
