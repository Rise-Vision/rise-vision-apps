'use strict';

/*jshint camelcase: false */

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

      var _getPlan = function (subscription) {
        var productCode = subscription.plan_id && subscription.plan_id.split('-')[0];

        var plan = _.find(PLANS_LIST, function (plan) {
          return plan.productCode === productCode;
        });

        return plan;
      };

      var _isVolumePlan = function (plan) {
        return plan && plan.type.indexOf('volume') !== -1;
      };

      var _getPeriod = function(subscription) {
        if (subscription.billing_period > 1) {
          return (subscription.billing_period + ' ' + (subscription.billing_period_unit === 'month' ?
            'Month' : 'Year'));
        } else {
          return subscription.billing_period_unit === 'month' ? 'Monthly' : 'Yearly';
        }
      };

      $scope.getSubscriptionDesc = function (subscription) {
        var prefix = subscription.plan_quantity > 1 ? subscription.plan_quantity + ' x ' : '';
        var plan = _getPlan(subscription);
        var name = plan ? plan.name : subscription.plan_id;
        
        // Show `1` plan_quantity for Per Display subscriptions
        if (plan && _isVolumePlan(plan) && subscription.plan_quantity > 0) {
          prefix = subscription.plan_quantity + ' x ';
        }
        
        var period = _getPeriod(subscription);

        if (_isVolumePlan(plan)) {
          name = name + ' ' + period + ' Plan';
        } else {
          name = name + ' Plan ' + period;
        }
        
        return prefix + name;
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
