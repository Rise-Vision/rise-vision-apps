(function () {
  'use strict';

  angular.module('risevision.editor.controllers')
    .controller('ProductDetailsModalController', ['$scope', '$modalInstance', 'presentationUtils', 'product',
      function ($scope, $modalInstance, presentationUtils, product) {
        $scope.product = product;
        $scope.showPreviewLink = !presentationUtils.isHtmlTemplate(product);

        $scope.select = function () {
          $modalInstance.close(product);
        };

        $scope.dismiss = function () {
          $modalInstance.dismiss();
        };
      }
    ]);
}());
