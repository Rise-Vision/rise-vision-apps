'use strict';

angular.module('risevision.displays.directives')
  .directive('preconfiguredMediaPlayer', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/preconfigured-media-player.html',
        link: function ($scope) {
          $scope.display = displayFactory.display;

        } //link()
      };
    }
  ]);
