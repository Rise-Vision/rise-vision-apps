'use strict';

angular.module('risevision.apps.billing.directives')
  .directive('shareUrlButton', ['$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        templateUrl: 'partials/billing/share-url-button.html',
        replace: true,
        scope: {},
        link: function ($scope, element) {
          var isTooltipOpen = false;

          $scope.dismiss = function () {
            $timeout(function () {
              isTooltipOpen = false;
              element.trigger('hide');
            });
          };

          $scope.toggleTooltip = function () {
            $timeout(function () {
              if (isTooltipOpen) {
                isTooltipOpen = false;
                element.trigger('hide');
              } else {
                isTooltipOpen = true;
                element.trigger('show');
              }
            });
          };
        }
      };
    }
  ]);
