'use strict';

angular.module('risevision.apps.directives')
  .directive('tooltipOverlay', ['$window', '$compile', '$timeout', 'honeBackdropFactory',
    function ($window, $compile, $timeout, honeBackdropFactory) {
      return {
        restrict: 'A',
        scope: {
          isShowing: '=tooltipOverlay'
        },
        terminal: true,
        priority: 1000,
        compile: function(element, attrs) {
          element.attr('tooltip-template', '"partials/launcher/share-tooltip.html"');
          element.attr('tooltip-trigger', 'show');
          element.attr('ng-click', 'dismiss()');
          element.removeAttr('tooltip-overlay'); //remove the attribute to avoid infinite loop

          return {
            pre: function preLink($scope, iElement, iAttrs, controller) {  },
            post: function postLink($scope, iElement, iAttrs, controller) {  
              $compile(iElement)($scope);

              var digestWrapper = function() {
                $scope.$digest();
              };

              var show = function() {
                if (element.is(':hidden')) { return; }

                honeBackdropFactory.createForElement(element, {});
                element.trigger('show');                
                angular.element($window).bind('resize', digestWrapper);
              };

              var hide = function() {
                honeBackdropFactory.hide();
                element.trigger('hide');
                angular.element($window).unbind('resize', digestWrapper);
              };

              $scope.$watch('isShowing', function() {
                $timeout(function() {
                  if ($scope.isShowing) {
                    show();
                  } else {
                    hide();
                  }                  
                });
              });

              $scope.dismiss = function() {
                $scope.isShowing = false;

                $scope.$emit('tooltipOverlay.dismissed');
              };
            }
          };
        }
      };
    }
  ]);
