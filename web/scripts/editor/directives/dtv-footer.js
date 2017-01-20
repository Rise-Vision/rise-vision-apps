'use strict';

angular.module('risevision.editor.directives')
  .directive('footer', ['editorFactory',
    function (editorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/editor/footerbar.html',
        link: function ($scope) {
          $scope.factory = editorFactory;
        }
      };
    }
  ]);
