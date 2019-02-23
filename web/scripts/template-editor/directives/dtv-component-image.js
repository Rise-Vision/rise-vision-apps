'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentImage', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/component-image.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
