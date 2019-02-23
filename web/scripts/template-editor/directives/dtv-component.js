'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponent', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/component.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
