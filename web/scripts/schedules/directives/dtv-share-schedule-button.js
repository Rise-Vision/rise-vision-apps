'use strict';

angular.module('risevision.schedules.directives')
  .directive('shareScheduleButton', ['$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/share-schedule-button.html',
        scope: {
          schedule: '='
        },
        link: function ($scope, element) {
          var isTooltipOpen = false;
          var tooltipButton = angular.element(element[0].querySelector('#tooltipButton'));

          var isActionSheetOpen = false;
          var actionSheetButton = angular.element(element[0].querySelector('#actionSheetButton'));

          $scope.dismiss = function () {
            $timeout(function () {
              if (isTooltipOpen) {
                isTooltipOpen = false;
                tooltipButton.trigger('hide');
              }

              if (isActionSheetOpen) {
                isActionSheetOpen = false;
                actionSheetButton.trigger('toggle');
              }
            });
          };

          $scope.toggleTooltip = function () {
            $timeout(function () {
              if (isTooltipOpen) {
                isTooltipOpen = false;
                tooltipButton.trigger('hide');
              } else {
                isTooltipOpen = true;
                tooltipButton.trigger('show');
              }
            });
          };

          $scope.toggleActionSheet = function () {
            if (isActionSheetOpen) {
              isActionSheetOpen = false;
              actionSheetButton.trigger('toggle');
            } else {
              isActionSheetOpen = true;
              actionSheetButton.trigger('toggle');
            }
          };
        }
      };
    }
  ]);
