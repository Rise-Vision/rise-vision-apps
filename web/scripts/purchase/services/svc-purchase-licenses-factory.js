(function (angular) {

  /*jshint camelcase: false */

  'use strict';

  angular.module('risevision.apps.purchase')
    .factory('purchaseLicensesFactory', ['$log', '$timeout', '$stateParams',
      'userState', 'currentPlanFactory', 'storeService', 'analyticsFactory', 'pricingFactory',
      function ($log, $timeout, $stateParams, userState, currentPlanFactory,
        storeService, analyticsFactory, pricingFactory) {
        var factory = {};
        factory.userEmail = userState.getUserEmail();

        var _clearMessages = function () {
          factory.loading = false;

          factory.errorMessage = '';
          factory.apiError = '';
        };

        factory.init = function (purchaseAction) {
          _clearMessages();

          factory.purchase = {};
          factory.purchase.completed = false;
          factory.purchase.displayCount = $stateParams.displayCount;
          factory.purchase.couponCode = '';
          factory.purchase.action = purchaseAction;

          factory.getEstimate();
        };

        var _getChangeInLicenses = function() {
          return factory.purchase.action === 'remove' ?
            -factory.purchase.displayCount : factory.purchase.displayCount;
        };

        var _getTotalDisplayCount = function () {
          var currentLicenses = currentPlanFactory.currentPlan.playerProTotalLicenseCount;

          return currentLicenses + _getChangeInLicenses();
        };

        var _getTrackingProperties = function () {
          return {
            subscriptionId: currentPlanFactory.currentPlan.subscriptionId,
            changeInLicenses: _getChangeInLicenses(),
            totalLicenses: _getTotalDisplayCount(),
            companyId: currentPlanFactory.currentPlan.billToId
          };
        };

        var _updatePerDisplayPrice = function () {
          if (!factory.estimate.next_invoice_estimate) {
            return;
          }

          var currentDisplayCount = currentPlanFactory.currentPlan.playerProTotalLicenseCount;
          var displayCount = _getTotalDisplayCount();

          var lineItem = factory.estimate.next_invoice_estimate.line_items[0];
          var isMonthly = lineItem.entity_id.endsWith('m');

          var educationDiscount = _.find(factory.estimate.next_invoice_estimate.line_item_discounts, {
            coupon_id: 'EDUCATION'
          });
          var isEducation = !!educationDiscount;

          factory.currentPricePerDisplay = pricingFactory.getPricePerDisplay(isMonthly, currentDisplayCount, isEducation);
          factory.newPricePerDisplay = pricingFactory.getPricePerDisplay(isMonthly, displayCount, isEducation);
        };

        factory.getEstimate = function () {
          _clearMessages();

          factory.loading = true;

          var couponCode = factory.purchase.couponCode;
          var displayCount = _getTotalDisplayCount();
          var subscriptionId = currentPlanFactory.currentPlan.subscriptionId;
          var companyId = currentPlanFactory.currentPlan.billToId;

          return storeService.estimateSubscriptionUpdate(displayCount, subscriptionId, companyId, couponCode)
            .then(function (result) {
              factory.estimate = result.item;

              _updatePerDisplayPrice();

              analyticsFactory.track('Subscription Update Estimated', _getTrackingProperties());
            })
            .catch(function (result) {
              factory.errorMessage = 'Something went wrong.';
              factory.apiError = result && result.message ? result.message :
                'An unexpected error has occurred. Please try again.';
            })
            .finally(function () {
              factory.loading = false;
            });
        };

        factory.completePayment = function () {
          _clearMessages();

          factory.loading = true;

          var couponCode = factory.purchase.couponCode;
          var displayCount = _getTotalDisplayCount();
          var subscriptionId = currentPlanFactory.currentPlan.subscriptionId;
          var companyId = currentPlanFactory.currentPlan.billToId;

          return storeService.updateSubscription(displayCount, subscriptionId, companyId, couponCode)
            .then(function () {
              analyticsFactory.track('Subscription Updated', _getTrackingProperties());

              return $timeout(10000);
            })
            .then(function () {
              factory.purchase.completed = true;

              return userState.reloadSelectedCompany()
                .catch(function (err) {
                  $log.debug('Failed to reload company', err);
                });
            })
            .catch(function (result) {
              factory.errorMessage = 'Something went wrong.';
              factory.apiError = result && result.message ? result.message :
                 'There was an unknown error with the payment.';
            })
            .finally(function () {
              factory.loading = false;
            });
        };

        return factory;
      }
    ]);

})(angular);
