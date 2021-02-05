'use strict';

angular.module('risevision.apps.controllers')
  .controller('BulkEditModalCtrl', ['$scope', '$modalInstance', 'baseModel', 'title', 'partial',
    function ($scope, $modalInstance, baseModel, title, partial) {
      $scope.baseModel = baseModel;
      $scope.title = title;
      $scope.partial = partial;

      $scope.save = function () {
        $modalInstance.close(baseModel);
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
