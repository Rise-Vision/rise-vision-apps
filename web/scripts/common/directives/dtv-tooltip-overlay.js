'use strict';

angular.module('risevision.apps.directives')
  .directive('tooltipOverlay', ['$compile', '$timeout', 'honeBackdropFactory',
    function ($compile, $timeout, honeBackdropFactory) {
      return {
        restrict: 'A',
        scope: {
          isShowing: '='
        },
        terminal: true, //this setting is important, see explanation below
        priority: 1000, //this setting is important, see explanation below
        compile: function(element, attrs) {
          element.attr('tooltip-template', '"partials/launcher/share-tooltip.html"');
          element.attr('tooltip-placement', 'bottom');
          element.attr('tooltip-class', 'madero-style');
          element.attr('tooltip-trigger', 'show');
          element.removeAttr("tooltip-overlay"); //remove the attribute to avoid indefinite loop

          return {
            pre: function preLink($scope, iElement, iAttrs, controller) {  },
            post: function postLink($scope, iElement, iAttrs, controller) {  
              $compile(iElement)($scope);

              $scope.$watch('isShowing', function() {
                $timeout(function() {
                  if ($scope.isShowing) {
                    honeBackdropFactory.createForElement(element, {});
                    element.trigger('show');
                  } else {
                    honeBackdropFactory.hide();
                    element.trigger('hide');
                  }                  
                });
              });

              $scope.dismiss = function() {
                $scope.isShowing = false;
              };
            }
          };
        }
      };
    }
  ]);
