'use strict';

angular.module('risevision.apps.billing.controllers')
  .value('INVOICES_PATH', 'account/view/invoicesHistory?cid=companyId')
  .controller('BillingCtrl', ['$scope', '$loading', '$window', 'userState', 'chargebeeFactory', 'STORE_URL', 'INVOICES_PATH',
    function ($scope, $loading, $window, userState, chargebeeFactory, STORE_URL, INVOICES_PATH) {
      $scope.viewPastInvoices = function () {
        chargebeeFactory.openBillingHistory(userState.getSelectedCompanyId());
      };

      $scope.viewPastInvoicesStore = function () {
        $window.open(STORE_URL + INVOICES_PATH.replace('companyId', userState.getSelectedCompanyId()), '_blank');
      };

      $loading.startGlobal('billing.loading');
      // Will use this when loading billing information from Store
      $loading.stopGlobal('billing.loading');
    }
  ]);
