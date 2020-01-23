'use strict';

angular.module('risevision.apps.billing.controllers')
  .value('PAST_INVOICES_PATH', 'account/view/invoicesHistory?cid=companyId')
  .value('UNPAID_INVOICES_PATH', 'account/view/invoicesDue?cid=companyId')
  .controller('BillingCtrl', ['$rootScope', '$scope', '$loading', '$window', '$timeout',
    'ScrollingListService', 'userState', 'currentPlanFactory', 'ChargebeeFactory', 'billing',
    'STORE_URL', 'PAST_INVOICES_PATH', 'UNPAID_INVOICES_PATH', 'companySettingsFactory',
    function ($rootScope, $scope, $loading, $window, $timeout, ScrollingListService, userState,
      currentPlanFactory, ChargebeeFactory, billing, STORE_URL, PAST_INVOICES_PATH, UNPAID_INVOICES_PATH,
      companySettingsFactory) {

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
      $rootScope.$on('risevision.company.planStarted', function() {
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

      $scope.viewPastInvoicesStore = function () {
        $window.open(STORE_URL + PAST_INVOICES_PATH.replace('companyId', userState.getSelectedCompanyId()),
          '_blank');
      };

      $scope.viewUnpaidInvoicesStore = function () {
        $window.open(STORE_URL + UNPAID_INVOICES_PATH.replace('companyId', userState.getSelectedCompanyId()),
          '_blank');
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

      $scope.getSubscriptionDesc = function (subscription) {
        var prefix = subscription.quantity > 1 ? subscription.quantity + ' x ' : '';

        // Show `1` quantity for Per Display subscriptions
        if (_isPerDisplay(subscription) && subscription.quantity > 0) {
          prefix = subscription.quantity + ' x ';
        }

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
