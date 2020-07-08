'use strict';

angular.module('risevision.apps.directives')
  .directive('tooltipOverlay', ['$compile', '$timeout', 'tourFactory', 'honeBackdropFactory',
    function ($compile, $timeout, tourFactory, honeBackdropFactory) {
      return {
        restrict: 'A',
        terminal: true,
        priority: 1000,
        compile: function (element, attrs) {
          element.attr('tooltip-trigger', 'show');
          element.attr('ng-click', 'dismiss()');
          element.attr('tooltip-animation', 'false');
          element.attr('tooltip-digest-on-resize', '');
          element.removeAttr('tooltip-overlay'); //remove the attribute to avoid infinite loop

          return {
            pre: function preLink($scope, iElement, iAttrs, controller) {},
            post: function postLink($scope, iElement, iAttrs, controller) {
              $compile(iElement)($scope);

              var show = function () {
                $timeout(function () {
                  if (element.is(':hidden')) {
                    return;
                  }

                  honeBackdropFactory.createForElement(element, {});
                  element.trigger('show');
                });
              };

              var hide = function () {
                $timeout(function () {
                  honeBackdropFactory.hide();
                  element.trigger('hide');
                });
              };

              $scope.$watch('tooltipKey', function () {
                if (!$scope.tooltipKey) { return; }

                if (tourFactory.isShowing($scope.tooltipKey)) {
                  show();
                } else {
                  $scope.tooltipKey = '';
                }
              });

              $scope.dismiss = function () {
                hide();

                tourFactory.dismissed($scope.tooltipKey);
                $scope.tooltipKey = '';
              };
            }
          };
        }
      };
    }
  ]);
