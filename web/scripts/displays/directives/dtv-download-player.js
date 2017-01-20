'use strict';

angular.module('risevision.displays.directives')
  .directive('downloadPlayer', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/download-player.html',
        link: function () {} //link()
      };
    }
  ]);
