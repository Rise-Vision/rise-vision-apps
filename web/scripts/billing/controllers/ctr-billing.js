'use strict';

angular.module('risevision.apps.billing.controllers')
  .value('INVOICES_PATH', 'account/view/invoicesHistory?cid=companyId')
  .controller('BillingCtrl', ['$scope', '$loading', '$window', '$modal', '$templateCache', 'ScrollingListService',
    'getCoreCountries', 'userState', 'chargebeeFactory', 'billing', 'STORE_URL', 'INVOICES_PATH',
    function ($scope, $loading, $window, $modal, $templateCache, ScrollingListService,
      getCoreCountries, userState, chargebeeFactory, billing, STORE_URL, INVOICES_PATH) {

      $scope.search = {
        sortBy: 'productName',
        count: $scope.listLimit,
        reverse: false,
        name: 'Subscriptions'
      };

      $scope.chargebeeFactory = chargebeeFactory;
      $scope.subscriptions = new ScrollingListService(billing.getSubscriptions, $scope.search);

      $scope.$watch('subscriptions.loadingItems', function (loading) {
        if (loading) {
          $loading.start('subscriptions-list-loader');
        } else {
          $loading.stop('subscriptions-list-loader');
        }
      });

      $scope.viewPastInvoices = function () {
        chargebeeFactory.openBillingHistory(userState.getSelectedCompanyId());
      };

      $scope.viewPastInvoicesStore = function () {
        $window.open(STORE_URL + INVOICES_PATH.replace('companyId', userState.getSelectedCompanyId()), '_blank');
      };

      $scope.editPaymentMethods = function () {
        chargebeeFactory.openPaymentSources(userState.getSelectedCompanyId());
      };

      $scope.editSubscription = function (subscription) {
        chargebeeFactory.openSubscriptionDetails(userState.getSelectedCompanyId(), subscription.subscriptionId);
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

      $scope.getSubscriptionDesc = function (subscription) {
        var period = _getPeriod(subscription);
        var currency = _getCurrency(subscription);

        return subscription.productName + ' (' + period + '/' + currency + ')';
      };

      $scope.isActive = function (subscription) {
        return subscription.status === 'Active';
      };

      $scope.isCancelled = function (subscription) {
        return subscription.status === 'Cancelled';
      };

      $scope.isSuspended = function (subscription) {
        return subscription.status === 'Suspended';
      };

      function _getCurrency (subscription) {
        return subscription.currencyCode.toUpperCase();
      }

      function _getPeriod (subscription) {
        return subscription.unit === 'per Display per Month' ? 'Monthly' : 'Yearly';
      }
    }
  ]);
