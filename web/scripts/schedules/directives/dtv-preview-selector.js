'use strict';

angular.module('risevision.schedules.directives')
  .directive('previewSelector', ['$timeout', '$loading', 'ScrollingListService', 'schedule', '$document',
    function ($timeout, $loading, ScrollingListService, schedule, $document) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/preview-selector.html',
        require: 'ngModel',
        scope: {
          ngModel: '=',
          onSelect: '&',
          label: '@?',
          additionalClass: '@?'
        },
        link: function ($scope, element, attrs, ctrl) {
          var selected;
          var tooltipElement = angular.element(element[0].querySelector('#preview-selector'));
          $scope.showTooltip = false;

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

          var _closeTooltip = function(event) {
            var tooltipContent = angular.element('#preview-selector-tooltip');
            if (tooltipContent && tooltipContent[0] && tooltipContent[0].contains(event.target) || 
              tooltipElement && tooltipElement[0] && tooltipElement[0].contains(event.target) ) {
              return;
            }
            $timeout(function () {
              $scope.toggleTooltip();
            });
          };

          $scope.$watch('showTooltip', function () {
            if ($scope.showTooltip) {
              $scope.schedules = new ScrollingListService(schedule.list, $scope.search);
              selected = $scope.ngModel;

              $timeout(function () {
                $document.bind('click', _closeTooltip);
                $document.bind('touchstart', _closeTooltip);
                tooltipElement.trigger('show');
              });
            } else {
              $timeout(function () {
                $document.unbind('click', _closeTooltip);
                $document.unbind('touchstart', _closeTooltip);
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
