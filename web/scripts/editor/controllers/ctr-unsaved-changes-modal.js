(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('UnsavedChangesModalController', ['$scope', '$modalInstance',
      'editorFactory',
      function ($scope, $modalInstance, editorFactory) {
        $scope.editorFactory = editorFactory;

        $scope.save = function () {
          editorFactory.save().then(function () {
            $modalInstance.dismiss();
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
