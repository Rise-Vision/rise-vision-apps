'use strict';

angular.module('risevision.schedules.directives')
  .directive('previewSelector', ['$timeout', '$loading', 'ScrollingListService', 'schedule', 'outsideClickHandler',
    function ($timeout, $loading, ScrollingListService, schedule, outsideClickHandler) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/preview-selector.html',
        require: 'ngModel',
        scope: {
          ngModel: '=',
          onSelect: '&',
          label: '@?',
          additionalClass: '@?',
          additionalTooltipClass: '@?'
        },
        link: function ($scope, element, attrs, ctrl) {
          var selected;
          var tooltipElement = angular.element(element[0].querySelector('#preview-selector'));
          $scope.showTooltip = false;

          $scope.filterConfig = {
            placeholder: 'Search schedules'
          };

          $scope.search = {
            sortBy: 'changeDate',
            reverse: true,
          };

          $scope.$watch('schedules.loadingItems', function (loading) {
            if (loading) {
              $loading.start('preview-selector-spinner');
            } else {
              $loading.stop('preview-selector-spinner');
            }
          });

          $scope.$watch('showTooltip', function () {
            if ($scope.showTooltip) {
              $scope.schedules = new ScrollingListService(schedule.list, $scope.search);
              selected = $scope.ngModel;

              $timeout(function () {
                outsideClickHandler.bind('preview-selector', '#preview-selector, #preview-selector-tooltip', $scope.toggleTooltip);
                tooltipElement.trigger('show');
              });
            } else {
              $timeout(function () {
                outsideClickHandler.unbind('preview-selector');                
                tooltipElement.trigger('hide');
              });
            }
          });

          $scope.toggleTooltip = function ($event) {
            $scope.showTooltip = !$scope.showTooltip;
          };

          $scope.select = function (schedule) {
            ctrl.$setViewValue(schedule);

            if ($scope.onSelect) {
              $scope.onSelect();
            }

            $scope.toggleTooltip();
          };
        }
      };
    }
  ]);
