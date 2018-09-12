'use strict';

angular.module('risevision.apps.billing.controllers')
  .value('INVOICES_PATH', 'account/view/invoicesHistory?cid=companyId')
  .controller('BillingCtrl', ['$rootScope', '$scope', '$loading', '$window', '$modal', '$templateCache', '$timeout',
    'ScrollingListService', 'getCoreCountries', 'userState', 'chargebeeFactory', 'billing', 'STORE_URL',
    'INVOICES_PATH',
    function ($rootScope, $scope, $loading, $window, $modal, $templateCache, $timeout, ScrollingListService,
      getCoreCountries, userState, chargebeeFactory, billing, STORE_URL, INVOICES_PATH) {

      $scope.search = {
        count: $scope.listLimit,
        sortBy: 'status',
        reverse: false,
        name: 'Subscriptions'
      };

      $scope.company = userState.getCopyOfSelectedCompany();
      $scope.chargebeeFactory = chargebeeFactory;
      $scope.subscriptions = new ScrollingListService(billing.getSubscriptions, $scope.search);

      $scope.$watch('subscriptions.loadingItems', function (loading) {
        if (loading) {
          $loading.start('subscriptions-list-loader');
        } else {
          $loading.stop('subscriptions-list-loader');
        }
      });

      $rootScope.$on('chargebee.subscriptionChanged', _reloadSubscriptions);
      $rootScope.$on('chargebee.subscriptionCancelled', _reloadSubscriptions);

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
        var subscriptionId = subscription.parentId || subscription.subscriptionId;

        chargebeeFactory.openSubscriptionDetails(userState.getSelectedCompanyId(), subscriptionId);
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
        var prefix = subscription.quantity > 1 ? subscription.quantity + ' x ' : '';
        var period = _getPeriod(subscription);
        var currency = _getCurrency(subscription);

        return prefix + subscription.productName + ' (' + period + '/' + currency + ')';
      };

      $scope.getSubscriptionPrice = function (subscription) {
        return subscription.quantity * subscription.price + subscription.shipping;
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

      function _reloadSubscriptions() {
        $timeout(function () {
          $loading.startGlobal('subscriptions-changed-loader');
        });

        $timeout(function () {
          $loading.stopGlobal('subscriptions-changed-loader');
          $scope.subscriptions.doSearch();
        }, 10000);
      }

      function _getCurrency(subscription) {
        return subscription.currencyCode.toUpperCase();
      }

      function _getPeriod(subscription) {
        return subscription.unit.toLowerCase().indexOf('per month') >= 0 ? 'Monthly' : 'Yearly';
      }
    }
  ]);
