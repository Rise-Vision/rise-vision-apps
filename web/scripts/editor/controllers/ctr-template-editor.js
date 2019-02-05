'use strict';

angular.module('risevision.editor.controllers')
  .controller('TemplateEditorController', ['$scope', 'templateEditorFactory', 'presentation',
    function ($scope, templateEditorFactory, presentation) {
      $scope.factory = templateEditorFactory;
      $scope.presentation = presentation;
    }
  ]);
