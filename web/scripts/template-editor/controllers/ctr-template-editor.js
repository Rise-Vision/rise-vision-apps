'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('TemplateEditorController', ['$scope', 'userState', 'templateEditorFactory', 'presentation',
    function ($scope, userState, templateEditorFactory, presentation) {
      $scope.factory = templateEditorFactory;
      $scope.presentation = presentation;

      $scope.isSubcompanySelected = userState.isSubcompanySelected;
      $scope.isTestCompanySelected = userState.isTestCompanySelected;
    }
  ]);
