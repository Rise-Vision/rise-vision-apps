'use strict';

angular.module('risevision.apps.billing.directives')
  .directive('shareUrlButton', ['$timeout', 'outsideClickHandler',
    function ($timeout, outsideClickHandler) {
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
              outsideClickHandler.unbind('share-url-button');
              element.trigger('hide');
            });
          };

          $scope.toggleTooltip = function () {
            $timeout(function () {
              if (isTooltipOpen) {
                isTooltipOpen = false;
                outsideClickHandler.unbind('share-url-button');
                element.trigger('hide');
              } else {
                isTooltipOpen = true;
                outsideClickHandler.bind('share-url-button', '#share-url-button, #share-url-popover', $scope.toggleTooltip);
                element.trigger('show');
              }
            });
          };
        }
      };
    }
  ]);
