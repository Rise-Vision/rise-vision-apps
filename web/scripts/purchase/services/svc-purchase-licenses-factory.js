(function (angular) {

  /*jshint camelcase: false */

  'use strict';

  angular.module('risevision.apps.purchase')
    .factory('purchaseLicensesFactory', ['$log', '$timeout', '$stateParams',
      'userState', 'currentPlanFactory', 'storeService', 'analyticsFactory',
      'pricingFactory', 'subscriptionFactory',
      function ($log, $timeout, $stateParams, userState, currentPlanFactory,
        storeService, analyticsFactory, pricingFactory, subscriptionFactory) {
        var factory = {};
        factory.userEmail = userState.getUserEmail();

        var _clearMessages = function () {
          factory.loading = false;

          factory.errorMessage = '';
          factory.apiError = '';
        };

        factory.init = function (purchaseAction) {
          _clearMessages();

          var isRemove = purchaseAction === 'remove';

          factory.purchase = {};
          factory.purchase.completed = false;
          factory.purchase.licensesToAdd = isRemove ? 0 : $stateParams.displayCount;
          factory.purchase.licensesToRemove = isRemove ? $stateParams.displayCount : 0;
          factory.purchase.couponCode = '';
          factory.subscriptionId = $stateParams.subscriptionId ||
            currentPlanFactory.currentPlan.subscriptionId;

          subscriptionFactory.getSubscription(factory.subscriptionId).then(function() {
            factory.getEstimate();
          });
        };

        factory.getCurrentDisplayCount = function() {
          return subscriptionFactory.item && subscriptionFactory.item.subscription &&
            subscriptionFactory.item.subscription.plan_quantity;
        };

        var _getCompanyId = function() {
          return subscriptionFactory.item && subscriptionFactory.item.subscription &&
            subscriptionFactory.item.subscription.customer_id;
        };

        var _getChangeInLicenses = function() {
          var licensesToAdd = factory.purchase.licensesToAdd || 0;
          var licensesToRemove = factory.purchase.licensesToRemove || 0;

          return licensesToAdd - licensesToRemove;
        };

        factory.getTotalDisplayCount = function () {
          return factory.getCurrentDisplayCount() + _getChangeInLicenses();
        };

        var _getTrackingProperties = function () {
          return {
            subscriptionId: factory.subscriptionId,
            changeInLicenses: _getChangeInLicenses(),
            totalLicenses: factory.getTotalDisplayCount(),
            companyId: _getCompanyId()
          };
        };

        var _updatePerDisplayPrice = function () {
          if (!factory.estimate.next_invoice_estimate) {
            return;
          }

          var currentDisplayCount = factory.getCurrentDisplayCount();
          var displayCount = factory.getTotalDisplayCount();

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
          var displayCount = factory.getTotalDisplayCount();
          var subscriptionId = factory.subscriptionId;
          var companyId = _getCompanyId();

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

        factory.getCreditTotal = function() {
          if (!factory.estimate || !factory.estimate.credit_note_estimates) {
            return 0;
          }

          var total = factory.estimate.credit_note_estimates.reduce(function(total, note) {
            return total + note.total;
          }, 0);

          return total / 100;
        };

        factory.completePayment = function () {
          _clearMessages();

          factory.loading = true;

          var couponCode = factory.purchase.couponCode;
          var displayCount = factory.getTotalDisplayCount();
          var subscriptionId = factory.subscriptionId;
          var companyId = _getCompanyId();

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
