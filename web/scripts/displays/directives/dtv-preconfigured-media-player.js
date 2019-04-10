'use strict';

angular.module('risevision.displays.directives')
  .directive('preconfiguredMediaPlayer', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/preconfigured-media-player.html',
        link: function ($scope) {
          $scope.factory = displayFactory;
          $scope.display = displayFactory.display;

          $scope.save = function () {
            if (!$scope.displayAdd.$valid) {
              console.error('form not valid: ', $scope.displayAdd.errors);
              return;
            }

            displayFactory.addDisplay().then(function () {
              $scope.display = displayFactory.display;
            });
          };

        } //link()
      };
    }
  ]);
