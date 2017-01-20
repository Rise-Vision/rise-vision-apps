'use strict';

angular.module('risevision.editor.directives')
  .directive('rvPopover', ['$timeout', 'editorFactory',
    function ($timeout, editorFactory) {
      return {
        scope: {
          popOnEventEnabled: '=',
          popOnEvent: '@'
        },
        restrict: 'A',
        link: function (scope, element) {
            scope.$on(scope.popOnEvent, function () {
              if (!editorFactory.presentation.id && scope.popOnEventEnabled) {
                scope.$parent.tooltipClasses = 'animated bounce'
                $timeout(function () {
                  element.trigger('show');
                  scope.$parent.tooltipClasses = ''
                });
              }
            });

            element.on('mouseenter', function () {
              if (!editorFactory.presentation.id) {
                element.trigger('show');
              }
            });

            element.on('mouseleave', function () {
              element.trigger('hide');
            });

            element.on('click', function () {
              element.trigger('hide');
            });
          } //link()
      };
    }
  ]);
