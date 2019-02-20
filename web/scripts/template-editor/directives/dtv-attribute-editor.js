'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeEditor', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/attribute-editor.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
