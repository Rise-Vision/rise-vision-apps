'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('BillingCtrl', ['$scope', '$loading', '$window', 'userState', 'chargebeeFactory', 'STORE_URL', 'ACCOUNT_PATH',
    function ($scope, $loading, $window, userState, chargebeeFactory, STORE_URL, ACCOUNT_PATH) {

      $scope.viewPastInvoices = function () {
        chargebeeFactory.openBillingHistory(userState.getSelectedCompanyId());
      };

      $scope.viewPastInvoicesStore = function () {
        $window.open(STORE_URL + ACCOUNT_PATH.replace('companyId', userState.getSelectedCompanyId()), '_blank');
      };

      $loading.startGlobal('billing.loading');

      $loading.stopGlobal('billing.loading');
    }
  ]);
