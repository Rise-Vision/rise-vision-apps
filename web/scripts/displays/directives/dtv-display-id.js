'use strict';

angular.module('risevision.displays.directives')
  .directive('displayId', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-id.html',
        link: function ($scope) {
          $scope.display = displayFactory.display;
        } //link()
      };
    }
  ]);
