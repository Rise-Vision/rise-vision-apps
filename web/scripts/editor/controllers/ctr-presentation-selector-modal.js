'use strict';

angular.module('risevision.editor.controllers')
  .controller('PresentationSelectorModal', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {
      $scope.select = function (presentationId, presentationName) {
        $modalInstance.close([presentationId, presentationName]);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
