'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleSelector', ['scheduleSelectorFactory', '$timeout',
    function (scheduleSelectorFactory, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/schedule-selector.html',
        scope: {
          onSelect: '='
        },
        link: function ($scope, element) {
          var tooltipElement = angular.element(element[0].querySelector('#schedule-selector'));
          $scope.factory = scheduleSelectorFactory;
          $scope.factory.loadNonSelectedSchedules();

          $scope.showTooltip = function($event) {
            $timeout(function() {
              tooltipElement.trigger('show');
            });
          };

          $scope.closeTooltip = function() {
            $timeout(function() {
              tooltipElement.trigger('hide');
            });
          };

          $scope.select = function() {
            $scope.onSelect($scope.factory.getSelectedIds());
            $scope.closeTooltip();
          }

          $scope.factory.loadNonSelectedSchedules();
        }
      };
    }
  ]);
