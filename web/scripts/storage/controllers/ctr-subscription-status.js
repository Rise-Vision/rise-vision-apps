'use strict';

angular.module('risevision.storage.controllers')
  .value('STORAGE_PRODUCT_CODE', 'b0cba08a4baa0c62b8cdc621b6f6a124f89a03db')
  .value('STORAGE_PRODUCT_ID', '24')
  .value('STORAGE_PRODUCT_LINK', 'https://www.risevision.com/pricing?utm_campaign=apps')
  .controller('SubscriptionStatusController', ['$scope', '$rootScope',
    'userState', 'plansFactory', 'STORAGE_PRODUCT_CODE', 'STORAGE_PRODUCT_ID', 'STORAGE_PRODUCT_LINK',
    function ($scope, $rootScope, userState, plansFactory, STORAGE_PRODUCT_CODE, STORAGE_PRODUCT_ID,
      STORAGE_PRODUCT_LINK) {
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.productCode = STORAGE_PRODUCT_CODE;
      $scope.productId = STORAGE_PRODUCT_ID;
      $scope.productLink = STORAGE_PRODUCT_LINK;
      $scope.subscriptionStatus = {};
      $scope.showPlansModal = plansFactory.showPlansModal;

      $rootScope.$on('selectedCompanyChanged', function (event, companyId) {
        $scope.companyId = userState.getSelectedCompanyId();
      });
    }
  ]);
