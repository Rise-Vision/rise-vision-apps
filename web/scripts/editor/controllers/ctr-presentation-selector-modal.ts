'use strict';

angular.module('risevision.editor.controllers')
  .controller('PresentationSelectorModal', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {
      $scope.select = function (presentationId, presentationName, presentationType) {
        $modalInstance.close([presentationId, presentationName, presentationType]);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
