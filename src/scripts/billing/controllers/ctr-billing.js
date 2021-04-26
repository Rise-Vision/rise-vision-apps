'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.controllers')
  .controller('BillingCtrl', ['$rootScope', '$scope', '$loading',
    'ScrollingListService', 'userState', 'currentPlanFactory', 'billing',
    'invoiceFactory', 'companySettingsFactory',
    function ($rootScope, $scope, $loading, ScrollingListService, userState,
      currentPlanFactory, billing, invoiceFactory, companySettingsFactory) {

      $scope.company = userState.getCopyOfSelectedCompany();
      $scope.currentPlan = currentPlanFactory.currentPlan;
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

      $rootScope.$on('risevision.company.planStarted', function () {
        $scope.subscriptions.doSearch();
      });

      $scope.showSubscriptionLink = function (subscription) {
        if (subscription.customer_id !== $scope.company.id) {
          return false;
        } else if ($scope.isCancelled(subscription)) {
          return false;
        }

        return true;
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

      $scope.isWriteOff = function (invoice) {
        if (!invoice || invoice.status !== 'paid') {
          return false;
        } else {
          return invoice.write_off_amount > 0;
        }
      };

    }
  ]);
