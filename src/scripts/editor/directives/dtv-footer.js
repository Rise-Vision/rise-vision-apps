'use strict';

angular.module('risevision.editor.directives')
  .directive('footer', ['editorFactory', 'artboardFactory',
    function (editorFactory, artboardFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/editor/footerbar.html',
        link: function ($scope) {
          $scope.factory = editorFactory;
          $scope.artboardFactory = artboardFactory;
        }
      };
    }
  ]);
