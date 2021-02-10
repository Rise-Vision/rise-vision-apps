'use strict';

angular.module('risevision.editor.directives')
  .directive('sidebar', ['placeholderFactory',
    function (placeholderFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/editor/sidebar.html',
        link: function ($scope) {
          $scope.factory = placeholderFactory;
          $scope.showPlaylist = true;
          $scope.$watch('factory.placeholder', function () {
            $scope.showPlaylist = true;
          });
        } //link()
      };
    }
  ]);
