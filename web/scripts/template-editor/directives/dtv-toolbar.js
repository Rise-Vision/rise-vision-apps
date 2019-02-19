'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorToolbar', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        template: 'partials/template-editor/toolbar.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
