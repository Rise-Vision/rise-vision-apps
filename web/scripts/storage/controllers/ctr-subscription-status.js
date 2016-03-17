'use strict';

angular.module('risevision.storage.controllers')
  .value('STORAGE_PRODUCT_CODE', 'b0cba08a4baa0c62b8cdc621b6f6a124f89a03db')
  .value('STORAGE_PRODUCT_ID', '24')
  .controller('SubscriptionStatusController', ['$scope', '$rootScope',
    'userState', 'STORAGE_PRODUCT_CODE', 'STORAGE_PRODUCT_ID',
    function ($scope, $rootScope, userState,
      STORE_PRODUCT_CODE, STORE_PRODUCT_ID) {
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.productCode = STORE_PRODUCT_CODE;
      $scope.productId = STORE_PRODUCT_ID;
      $scope.subscriptionStatus = {};

      $rootScope.$on('selectedCompanyChanged', function (event, companyId) {
        $scope.companyId = userState.getSelectedCompanyId();
      });
    }
  ]);
