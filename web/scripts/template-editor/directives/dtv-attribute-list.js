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

          $scope.components = templateEditorFactory.blueprintData.components;
          $scope.components = [].concat($scope.components, $scope.components, $scope.components, $scope.components, $scope.components);
          $scope.components = [].concat($scope.components, $scope.components, $scope.components, $scope.components, $scope.components);
        }
      };
    }
  ]);
