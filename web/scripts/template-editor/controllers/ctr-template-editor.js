'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('TemplateEditorController', ['$scope', 'templateEditorFactory', 'presentation',
    function ($scope, templateEditorFactory, presentation) {
      $scope.factory = templateEditorFactory;
      $scope.presentation = presentation;

      var presentationId = $scope.$watch('factory.presentation', function (presentationValue) {
        if (presentationValue && !presentationValue.id) {
          templateEditorFactory.addPresentation();

          presentationId();
        }
      });
    }
  ]);

angular.module('risevision.template-editor.directives')
  .directive('template-editor-toolbar', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/toolbar.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
