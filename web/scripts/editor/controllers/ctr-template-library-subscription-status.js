'use strict';

angular.module('risevision.editor.controllers')
  .value('TEMPLATE_LIBRARY_PRODUCT_CODE', '61dd6aa64152a228522ddf5950e5abb526416f27')
  .value('TEMPLATE_LIBRARY_PRODUCT_ID', '300')
  .value('TEMPLATE_LIBRARY_PRODUCT_LINK', 'https://www.risevision.com/pricing?utm_campaign=apps')
  .controller('TemplateLibrarySubscriptionStatusController', ['$scope', '$rootScope',
    'userState', 'planFactory', 'TEMPLATE_LIBRARY_PRODUCT_CODE', 'TEMPLATE_LIBRARY_PRODUCT_ID',
    'TEMPLATE_LIBRARY_PRODUCT_LINK',
    function ($scope, $rootScope, userState, planFactory,
      TEMPLATE_LIBRARY_PRODUCT_CODE, TEMPLATE_LIBRARY_PRODUCT_ID, TEMPLATE_LIBRARY_PRODUCT_LINK) {
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.productCode = TEMPLATE_LIBRARY_PRODUCT_CODE;
      $scope.productId = TEMPLATE_LIBRARY_PRODUCT_ID;
      $scope.productLink = TEMPLATE_LIBRARY_PRODUCT_LINK;
      $scope.subscriptionStatus = {};
      $scope.showPlansModal = planFactory.showPlansModal;

    }
  ]);
