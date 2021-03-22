'use strict';
angular.module('risevision.template-editor.controllers')
  .controller('PlaylistItemJsonController', ['$scope', '$modalInstance', 'item',
    function ($scope, $modalInstance, item) {
      $scope.formData = {};

      var _init = function () {
        $scope.formData.playlistItemJson = JSON.stringify(item);
      };

      _init();

      $scope.save = function () {
        try {
          var updatedItem = JSON.parse($scope.formData.playlistItemJson);

          $modalInstance.close(updatedItem);
        }
        catch(e) {}
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]);
