'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          $scope.attributes = [
            { id: '1', type: 'Financial', label: 'Currencies' },
            { id: '2', type: 'Financial', label: 'Energy & Metals' },
            { id: '3', type: 'Financial', label: 'Indices' },
            { id: '4', type: 'Financial', label: 'Currencies' }
          ];
        }
      };
    }
  ]);
