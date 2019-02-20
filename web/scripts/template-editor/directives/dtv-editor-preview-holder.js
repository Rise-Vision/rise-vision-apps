'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/preview-holder.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
