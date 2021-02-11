'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponent', ['templateEditorFactory', 'basicStorageSelectorFactory',
    function (templateEditorFactory, basicStorageSelectorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/component.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
          $scope.basicStorageSelectorFactory = basicStorageSelectorFactory;
        }
      };
    }
  ]);
