'use strict';

angular.module('risevision.schedules.directives')
  .directive('shareScheduleButton', ['$timeout', 'currentPlanFactory', 'plansFactory', '$window',
    function ($timeout, currentPlanFactory, plansFactory, $window) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/share-schedule-button.html',
        scope: {
          schedule: '=',
          buttonClass: '@'
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
                _closeActionSheet();
              }
            });
          };

          $scope.toggleTooltip = function () {
            if (!currentPlanFactory.isPlanActive()) {
              return plansFactory.showUnlockThisFeatureModal();
            }
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
            if (!currentPlanFactory.isPlanActive()) {
              return plansFactory.showUnlockThisFeatureModal();
            }
            if (isActionSheetOpen) {
              _closeActionSheet();
            } else {
              isActionSheetOpen = true;
              angular.element($window).bind('resize', $scope.toggleActionSheet);
              actionSheetButton.trigger('toggle');
            }
          };

          var _closeActionSheet = function () {
            isActionSheetOpen = false;
            angular.element($window).unbind('resize', $scope.toggleActionSheet);
            actionSheetButton.trigger('toggle');
          };

          $scope.$on('$destroy', function () {
            angular.element($window).unbind('resize', $scope.toggleActionSheet);
          });
        }
      };
    }
  ]);
