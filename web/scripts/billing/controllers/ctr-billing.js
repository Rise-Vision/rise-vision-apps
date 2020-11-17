'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('BillingCtrl', ['$rootScope', '$scope', '$loading', '$timeout',
    'ScrollingListService', 'userState', 'currentPlanFactory', 'ChargebeeFactory', 'billing',
    'PLANS_LIST', 'companySettingsFactory',
    function ($rootScope, $scope, $loading, $timeout, ScrollingListService, userState,
      currentPlanFactory, ChargebeeFactory, billing, PLANS_LIST, companySettingsFactory) {

      $scope.search = {
        count: $scope.listLimit,
        sortBy: 'status',
        reverse: false,
        name: 'Subscriptions'
      };

      $scope.company = userState.getCopyOfSelectedCompany();
      $scope.currentPlan = currentPlanFactory.currentPlan;
      $scope.chargebeeFactory = new ChargebeeFactory();
      $scope.subscriptions = new ScrollingListService(billing.getSubscriptions, $scope.search);
      $scope.companySettingsFactory = companySettingsFactory;

      $scope.hasUnpaidInvoices = false;

      $scope.$watch('subscriptions.loadingItems', function (loading) {
        if (loading) {
          $loading.start('subscriptions-list-loader');
        } else {
          $loading.stop('subscriptions-list-loader');
        }
      });

      $rootScope.$on('chargebee.subscriptionChanged', _reloadSubscriptions);
      $rootScope.$on('chargebee.subscriptionCancelled', _reloadSubscriptions);
      $rootScope.$on('risevision.company.planStarted', function () {
        $scope.subscriptions.doSearch();
      });

      $scope.viewPastInvoices = function () {
        $scope.chargebeeFactory.openBillingHistory(userState.getSelectedCompanyId());
      };

      $scope.checkCreationDate = function () {
        var creationDate = (($scope.company && $scope.company.creationDate) ?
          (new Date($scope.company.creationDate)) : (new Date()));
        return creationDate < new Date('Sep 1, 2018');
      };

      var _loadUnpaidInvoices = function () {
        $scope.invoices = new ScrollingListService(billing.getUnpaidInvoices);

        var $watch = $scope.$watch('invoices.loadingItems', function (loading) {
          if (loading === false) {
            $scope.hasUnpaidInvoices = $scope.invoices.items.list.length > 0;

            $watch();
          }
        });
      };

      _loadUnpaidInvoices();

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

      function _reloadSubscriptions() {
        $timeout(function () {
          $loading.startGlobal('subscriptions-changed-loader');
        });

        $timeout(function () {
          $loading.stopGlobal('subscriptions-changed-loader');
          $scope.subscriptions.doSearch();
        }, 10000);
      }

      function _getPeriod(subscription) {
        if (subscription.billingPeriod > 1) {
          return (subscription.billingPeriod + ' ' + (subscription.unit.toLowerCase().indexOf('per month') >= 0 ?
            'Month' : 'Year'));
        } else {
          return subscription.unit.toLowerCase().indexOf('per month') >= 0 ? 'Monthly' : 'Yearly';
        }
      }

      function _isPerDisplay(subscription) {
        return subscription.unit.toLowerCase().indexOf('per display') >= 0 ? true : false;
      }

    }
  ]);
