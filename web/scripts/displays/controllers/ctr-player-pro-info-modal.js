'use strict';
angular.module('risevision.displays.controllers')
  .controller('PlayerProInfoModalCtrl', ['$scope', '$modalInstance', 
    'displayFactory', 'playerProFactory', 'userState',
    'STORE_URL', 'ACCOUNT_PATH',
    function ($scope, $modalInstance, displayFactory, playerProFactory, userState,
      STORE_URL, ACCOUNT_PATH) {
      $scope.display = displayFactory.display;
      $scope.productLink = playerProFactory.getProductLink();
      $scope.accountLink = STORE_URL + ACCOUNT_PATH
        .replace('companyId', userState.getSelectedCompanyId());

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
