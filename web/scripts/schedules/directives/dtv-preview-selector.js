'use strict';

angular.module('risevision.schedules.directives')
  .directive('previewSelector', ['$timeout', '$loading',
    function ($timeout, $loading) {
      return {
        restrict: 'A',
        link: function ($scope, element) {
          var selected;
          var tooltipElement = angular.element(element[0].querySelector('#preview-selector'));
          $scope.showTooltip = false;

          $scope.$watch('schedules.loadingItems', function (loading) {
            if (loading) {
              $loading.start('preview-selector-spinner');
            } else {
              $loading.stop('preview-selector-spinner');
            }
          });

          $scope.$watch('showTooltip', function () {
            if ($scope.showTooltip) {
              selected = $scope.selectedSchedule;

              $timeout(function () {
                tooltipElement.trigger('show');
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

          $scope.selectSchedule = function (schedule) {
            selected = schedule;
          };

          $scope.isSelected = function (schedule) {
            return selected.id === schedule.id;
          };

          $scope.select = function () {
            $scope.selectedSchedule = selected;

            $scope.toggleTooltip();
          };
        }
      };
    }
  ]);
