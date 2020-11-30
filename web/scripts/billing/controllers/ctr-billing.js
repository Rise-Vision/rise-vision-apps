'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('BillingCtrl', ['$rootScope', '$scope', '$loading', '$timeout',
    'ScrollingListService', 'userState', 'currentPlanFactory', 'ChargebeeFactory', 'billing',
    'billingFactory', 'PLANS_LIST', 'companySettingsFactory',
    function ($rootScope, $scope, $loading, $timeout, ScrollingListService, userState,
      currentPlanFactory, ChargebeeFactory, billing, billingFactory, PLANS_LIST, 
      companySettingsFactory) {

      $scope.company = userState.getCopyOfSelectedCompany();
      $scope.currentPlan = currentPlanFactory.currentPlan;
      $scope.chargebeeFactory = new ChargebeeFactory();
      $scope.billingFactory = billingFactory;

      $scope.subscriptions = new ScrollingListService(billing.getSubscriptions, {
        sortBy: 'status',
        reverse: false,
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
        var subscriptionId = subscription.parentId || subscription.subscriptionId;

        $scope.chargebeeFactory.openSubscriptionDetails(userState.getSelectedCompanyId(), subscriptionId);
      };

      var _getVolumePlan = function (subscription) {
        var volumePlan = _.find(PLANS_LIST, function (plan) {
          return plan.productCode === subscription.productCode &&
            plan.type.indexOf('volume') !== -1;
        });

        return volumePlan;
      };

      $scope.getSubscriptionDesc = function (subscription) {
        var prefix = subscription.quantity > 1 ? subscription.quantity + ' x ' : '';
        var volumePlan = _getVolumePlan(subscription);

        // Show `1` quantity for Per Display subscriptions
        if ((_isPerDisplay(subscription) || volumePlan) && subscription.quantity > 0) {
          prefix = subscription.quantity + ' x ';
        }

        var period = _getPeriod(subscription);
        var name = volumePlan ? volumePlan.name : subscription.productName;

        return prefix + name + ' ' + period + (volumePlan ? ' Plan' : '');
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

      var _getPeriod = function(subscription) {
        if (subscription.billingPeriod > 1) {
          return (subscription.billingPeriod + ' ' + (subscription.unit.toLowerCase().indexOf('per month') >= 0 ?
            'Month' : 'Year'));
        } else {
          return subscription.unit.toLowerCase().indexOf('per month') >= 0 ? 'Monthly' : 'Yearly';
        }
      };

      var _isPerDisplay = function(subscription) {
        return subscription.unit.toLowerCase().indexOf('per display') >= 0 ? true : false;
      };

    }
  ]);
