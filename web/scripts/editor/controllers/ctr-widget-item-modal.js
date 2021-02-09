'use strict';
angular.module('risevision.editor.controllers')

  .controller('WidgetItemModalController', [
    '$scope', '$modalInstance',
    function ($scope, $modalInstance) {
      $scope.form = {
        url: undefined,
        settingsUrl: undefined
      };

      $scope.apply = function () {
        $modalInstance.close($scope.form);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
