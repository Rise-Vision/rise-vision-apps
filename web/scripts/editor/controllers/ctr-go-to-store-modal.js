(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('GoToStoreModalController', ['$scope', '$modalInstance',
      'product',
      function ($scope, $modalInstance, product) {
        $scope.product = product;

        $scope.close = function () {
          $modalInstance.close();
        };

        $scope.dismiss = function () {
          $modalInstance.dismiss();
        };
      }
    ]);
}());
