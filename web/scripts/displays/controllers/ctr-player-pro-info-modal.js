'use strict';
angular.module('risevision.displays.controllers')
  .controller('PlayerProInfoModalCtrl', ['$scope', '$modalInstance', 
    'displayFactory', 'playerProFactory',
    'STORE_URL', 'IN_RVA_PATH', 'ACCOUNT_PATH', 'PLAYER_PRO_PRODUCT_ID',
    function ($scope, $modalInstance, displayFactory, playerProFactory,
      STORE_URL, IN_RVA_PATH, ACCOUNT_PATH, PLAYER_PRO_PRODUCT_ID) {
      $scope.display = displayFactory.display;
      $scope.productLink = STORE_URL + IN_RVA_PATH
        .replace('productId', PLAYER_PRO_PRODUCT_ID);
      $scope.accountLink = STORE_URL + ACCOUNT_PATH;

      $scope.startTrial = function () {
        playerProFactory.startPlayerProTrial()
          .then(function () {
            $modalInstance.close();
          });
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
