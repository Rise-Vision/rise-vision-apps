'use strict';

angular.module('risevision.editor.controllers')
  .controller('PresentationMultiSelectorModal', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {
      $scope.selected = [];

      $scope.togglePresentation = function (presentation) {
        var index = _.findIndex($scope.selected, {
          id: presentation.id
        });
        if (index > -1) {
          $scope.selected.splice(index, 1);
        } else {
          $scope.selected.push(presentation);
        }
      };

      $scope.isSelected = function (presentationId) {
        var presentation = _.find($scope.selected, {
          id: presentationId
        });

        return !!presentation;
      };

      $scope.add = function () {
        $modalInstance.close($scope.selected);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
