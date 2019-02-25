'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentFinancial', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-financial.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
