'use strict';

angular.module('risevision.displays.directives')
  .directive('displayAdded', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-added.html',
        link: function ($scope) {
          $scope.display = displayFactory.display;

        } //link()
      };
    }
  ]);
