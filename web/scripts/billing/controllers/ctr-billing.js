'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('BillingCtrl', ['$rootScope', '$scope', '$loading', '$timeout',
    'ScrollingListService', 'userState', 'currentPlanFactory', 'ChargebeeFactory', 'billing',
    'invoiceFactory', 'companySettingsFactory',
    function ($rootScope, $scope, $loading, $timeout, ScrollingListService, userState,
      currentPlanFactory, ChargebeeFactory, billing, invoiceFactory,
      companySettingsFactory) {

      $scope.company = userState.getCopyOfSelectedCompany();
      $scope.currentPlan = currentPlanFactory.currentPlan;
      $scope.chargebeeFactory = new ChargebeeFactory();
      $scope.invoiceFactory = invoiceFactory;

      $scope.subscriptions = new ScrollingListService(billing.getSubscriptions, {
        name: 'Subscriptions'
      });
      $scope.invoices = new ScrollingListService(billing.getInvoices, {
        name: 'Invoices'
      });
      $scope.companySettingsFactory = companySettingsFactory;

      $scope.$watchGroup([
        'subscriptions.loadingItems',
        'invoices.loadingItems'
      ], function (newValues) {
        if (newValues[0] || newValues[1]) {
          $loading.start('billing-loader');
        } else {
          $loading.stop('billing-loader');
        }
      });

      var _reloadSubscriptions = function () {
        $loading.start('billing-loader');

        $timeout(function () {
          $scope.subscriptions.doSearch();
        }, 10000);
      };

      $rootScope.$on('chargebee.subscriptionChanged', _reloadSubscriptions);
      $rootScope.$on('chargebee.subscriptionCancelled', _reloadSubscriptions);
      $rootScope.$on('risevision.company.planStarted', function () {
        $scope.subscriptions.doSearch();
      });

      $scope.editPaymentMethods = function () {
        $scope.chargebeeFactory.openPaymentSources(userState.getSelectedCompanyId());
      };

      $scope.editSubscription = function (subscription) {
        var subscriptionId = subscription.id;

        $scope.chargebeeFactory.openSubscriptionDetails(userState.getSelectedCompanyId(), subscriptionId);
      };

      $scope.isActive = function (subscription) {
        return subscription.status === 'active';
      };

      $scope.isCancelled = function (subscription) {
        return subscription.status === 'cancelled';
      };

      $scope.isSuspended = function (subscription) {
        return subscription.status === 'suspended';
      };

    }
  ]);
