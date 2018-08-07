'use strict';

angular.module('risevision.apps.billing.controllers')
  .value('INVOICES_PATH', 'account/view/invoicesHistory?cid=companyId')
  .controller('BillingCtrl', ['$scope', '$loading', '$window', '$modal', '$templateCache',
    'getCoreCountries', 'userState', 'chargebeeFactory', 'STORE_URL', 'INVOICES_PATH',
    function ($scope, $loading, $window, $modal, $templateCache,
      getCoreCountries, userState, chargebeeFactory, STORE_URL, INVOICES_PATH) {

      $scope.viewPastInvoices = function () {
        chargebeeFactory.openBillingHistory(userState.getSelectedCompanyId());
      };

      $scope.viewPastInvoicesStore = function () {
        $window.open(STORE_URL + INVOICES_PATH.replace('companyId', userState.getSelectedCompanyId()), '_blank');
      };

      $scope.editPaymentMethods = function () {
        chargebeeFactory.openPaymentSources(userState.getSelectedCompanyId());
      };

      $scope.showCompanySettings = function () {
        $modal.open({
          template: $templateCache.get('company-settings-modal.html'),
          controller: 'CompanySettingsModalCtrl',
          size: 'lg',
          resolve: {
            companyId: function () {
              return userState.getSelectedCompanyId();
            },
            countries: function () {
              return getCoreCountries();
            }
          }
        });
      };

      $loading.startGlobal('billing.loading');
      // Will use this when loading billing information from Store
      $loading.stopGlobal('billing.loading');
    }
  ]);
