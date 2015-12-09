'use strict';

angular.module('risevision.editor.controllers')
  .controller('PresentationPropertiesModalController', ['$scope',
    '$modalInstance', 'presentationPropertiesFactory', 'editorFactory',
    'placeholdersFactory', 'userState',
    function ($scope, $modalInstance, presentationPropertiesFactory,
      editorFactory, placeholdersFactory, userState) {

      $scope.presentationProperties = presentationPropertiesFactory.getPresentationProperties();
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.placeholders = placeholdersFactory.getPlaceholders();

      $scope.copy = function () {
        editorFactory.copyPresentation();
        $scope.dismiss();
      };

      $scope.apply = function () {
        if (!$scope.presentationPropertiesDetails.$invalid) {
          presentationPropertiesFactory.setPresentationProperties($scope.presentationProperties);
          $scope.dismiss();
        }
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]); //ctr
