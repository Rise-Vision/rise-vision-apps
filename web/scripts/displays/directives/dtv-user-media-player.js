'use strict';

angular.module('risevision.displays.directives')
  .directive('userMediaPlayer', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/user-media-player.html',
        scope: true,
        link: function ($scope) {
          $scope.currentTab = 'windows';

          $scope.setCurrentTab = function (tabName) {
            $scope.currentTab = tabName;
          };

        } //link()
      };
    }
  ]);
