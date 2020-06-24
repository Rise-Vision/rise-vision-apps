'use strict';

angular.module('risevision.apps.directives')
  .directive('tooltipDigestOnResize', ['$window',
    function ($window) {
      return {
        restrict: 'A',
        link: function ($scope, element) {

          var digestWrapper = function () {
            // trigger $digest cycle to reposition tooltip
            $scope.$digest();
          };

          element.bind('show', function () {
            angular.element($window).bind('resize', digestWrapper);
          });

          element.bind('hide', function () {
            angular.element($window).unbind('resize', digestWrapper);
          });
        }
      };
    }
  ]);
