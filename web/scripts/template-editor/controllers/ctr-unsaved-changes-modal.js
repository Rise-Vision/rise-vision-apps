(function () {
  'use strict';

  angular.module('risevision.template-editor.controllers')
    .controller('TemplateEditorUnsavedChangesModalController', ['$scope', '$modalInstance',
      'templateEditorFactory',
      function ($scope, $modalInstance, templateEditorFactory) {
        $scope.templateEditorFactory = templateEditorFactory;

        $scope.save = function () {
          templateEditorFactory.save().then(function () {
            $modalInstance.close();
          });
        };

        $scope.dontSave = function () {
          $modalInstance.close();
        };

        $scope.dismiss = function () {
          $modalInstance.dismiss();
        };
      }
    ]);
}());
