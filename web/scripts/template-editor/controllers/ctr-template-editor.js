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
