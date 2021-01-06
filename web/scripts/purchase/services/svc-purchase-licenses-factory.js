(function (angular) {

  /*jshint camelcase: false */

  'use strict';

  angular.module('risevision.apps.purchase')
    .factory('purchaseLicensesFactory', ['$rootScope', '$q', '$log', '$timeout', '$stateParams',
      'userState', 'currentPlanFactory', 'storeService', 'addressService', 'creditCardFactory',
      'analyticsFactory', 'pricingFactory',
      function ($rootScope, $q, $log, $timeout, $stateParams, userState, currentPlanFactory, 
        storeService, addressService, creditCardFactory, analyticsFactory, pricingFactory) {
        var factory = {};
        factory.userEmail = userState.getUserEmail();

        factory.init = function () {
          _clearMessages();

          factory.purchase = {};
          factory.purchase.completed = false;
          factory.purchase.displayCount = $stateParams.displayCount;
          factory.purchase.couponCode = '';

          factory.getEstimate();

          // factory.purchase.plan = angular.copy(currentPlanFactory.currentPlan);
          // factory.purchase.couponCode = '';

          // factory.purchase.estimate = {};

          // creditCardFactory.initPaymentMethods();
          // creditCardFactory.loadCreditCards();

          // creditCardFactory.paymentMethods.paymentMethod = 'card';

          // var invoiceDate = new Date();
          // invoiceDate.setDate(invoiceDate.getDate() + 30);
          // creditCardFactory.paymentMethods.invoiceDate = invoiceDate;
        };

        // factory.updatePlan = function (displays, isMonthly, total) {
          // var period = !isMonthly ? 'Yearly' : 'Monthly';
          // var s = displays > 1 ? 's' : '';
          // var planName = '' + displays + ' Display License' + s + ' (' + period + ')';

          // factory.purchase.plan.name = planName;
          // factory.purchase.plan.displays = displays;
          // factory.purchase.plan.isMonthly = isMonthly;
          // if (isMonthly) {
          //   factory.purchase.plan.monthly.billAmount = total;
          // } else {
          //   factory.purchase.plan.yearly.billAmount = total;
          // }

          // purchaseFlowTracker.trackProductAdded(factory.purchase.plan);
        // };

        // factory.preparePaymentIntent = function () {
        //   var paymentMethods = creditCardFactory.paymentMethods;

        //   if (paymentMethods.paymentMethod === 'invoice') {
        //     return $q.resolve();
        //   } else if (paymentMethods.paymentMethod === 'card') {
        //     var jsonData = _getOrderAsJson();

        //     factory.loading = true;

        //     return storeService.preparePurchase(jsonData)
        //       .then(function (response) {
        //         if (response.error) {
        //           factory.purchase.checkoutError = response.error;
        //           return $q.reject(response.error);
        //         } else {
        //           paymentMethods.intentResponse = response;
        //           if (response.authenticationRequired) {
        //             return creditCardFactory.authenticate3ds(response.intentSecret);
        //           } else {
        //             return $q.resolve();
        //           }
        //         }
        //       })
        //       .catch(function (error) {
        //         factory.purchase.checkoutError = error.message || 'Something went wrong, please retry';
        //         return $q.reject(error);
        //       })
        //       .finally(function () {
        //         factory.loading = false;
        //       });
        //   }
        // };

        // factory.validatePaymentMethod = function () {
        //   factory.purchase.checkoutError = null;

        //   if (creditCardFactory.paymentMethods.paymentMethod === 'invoice') {
        //     // TODO: Check Invoice credit (?)
        //     return $q.resolve();
        //   } else if (creditCardFactory.paymentMethods.paymentMethod === 'card') {
        //     factory.loading = true;

        //     return creditCardFactory.validatePaymentMethod()
        //       .finally(function () {
        //         factory.loading = false;
        //       });
        //   }
        // };

        // var _getBillingPeriod = function () {
        //   return factory.purchase.plan.isMonthly ? '01m' : '01y';
        // };

        // var _getCurrency = function () {
        //   return (factory.purchase.billingAddress.country === 'CA') ? 'cad' : 'usd';
        // };

        // var _getChargebeePlanId = function () {
        //   return factory.purchase.plan.productCode + '-' + _getCurrency() + _getBillingPeriod();
        // };

        var _getTrackingProperties = function () {
          return {
            subscriptionId: currentPlanFactory.currentPlan.subscriptionId,
            changeInLicenses: factory.purchase.displayCount,
            totalLicenses: factory.purchase.displayCount + currentPlanFactory.currentPlan.playerProTotalLicenseCount,
            companyId: currentPlanFactory.currentPlan.billToId
          };
        };

        var _clearMessages = function () {
          factory.loading = false;

          factory.errorMessage = '';
          factory.apiError = '';
        };

        var _updatePerDisplayPrice = function () {
          if (!factory.estimate.next_invoice_estimate) {
            return;
          }

          var currentDisplayCount = currentPlanFactory.currentPlan.playerProTotalLicenseCount;
          var displayCount = factory.purchase.displayCount + currentDisplayCount;

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
          var displayCount = factory.purchase.displayCount + currentPlanFactory.currentPlan.playerProTotalLicenseCount;
          var subscriptionId = currentPlanFactory.currentPlan.subscriptionId;
          var companyId = currentPlanFactory.currentPlan.billToId;

          return storeService.estimateSubscriptionUpdate(displayCount, subscriptionId, companyId, couponCode)
            .then(function (result) {
              factory.estimate = result.item;

              _updatePerDisplayPrice();

              analyticsFactory.track('Subscription Update Estimated', _getTrackingProperties());

              // var estimate = {};

              // estimate.currency = _getCurrency();
              // estimate.taxesCalculated = true;
              // estimate.taxes = result.taxes || [];
              // estimate.total = result.total;
              // estimate.subTotal = result.subTotal;
              // estimate.coupons = result.coupons || [];
              // estimate.couponAmount = result.couponAmount;
              // estimate.totalTax = result.totalTax;
              // estimate.shippingTotal = result.shippingTotal;

              // factory.purchase.estimate = estimate;

              // purchaseFlowTracker.trackPlaceOrderClicked(_getTrackingProperties());
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

        // var _getOrderAsJson = function () {
        //   //clean up items
        //   var paymentMethods = creditCardFactory.paymentMethods;
        //   var newItems = [{
        //     id: _getChargebeePlanId(),
        //     qty: factory.purchase.plan.displays
        //   }];

        //   var card = paymentMethods.selectedCard;
        //   var cardData = paymentMethods.paymentMethod === 'invoice' ? null : {
        //     cardId: card.id,
        //     intentId: paymentMethods.intentResponse ? paymentMethods.intentResponse.intentId : null,
        //     isDefault: card.isDefault ? true : false
        //   };

        //   var obj = {
        //     billTo: addressService.copyAddress(factory.purchase.billingAddress),
        //     shipTo: addressService.copyAddress(factory.purchase.billingAddress),
        //     couponCode: factory.purchase.couponCode,
        //     items: newItems,
        //     purchaseOrderNumber: paymentMethods.purchaseOrderNumber,
        //     card: cardData,
        //     paymentMethodId: creditCardFactory.getPaymentMethodId()
        //   };

        //   return JSON.stringify(obj);
        // };

        factory.completePayment = function () {
          // var jsonData = _getOrderAsJson();

          _clearMessages();

          factory.loading = true;

          var couponCode = factory.purchase.couponCode;
          var displayCount = factory.purchase.displayCount + currentPlanFactory.currentPlan.playerProTotalLicenseCount;
          var subscriptionId = currentPlanFactory.currentPlan.subscriptionId;
          var companyId = currentPlanFactory.currentPlan.billToId;

          return storeService.updateSubscription(displayCount, subscriptionId, companyId, couponCode)
            .then(function () {
              analyticsFactory.track('Subscription Updated', _getTrackingProperties());

              return $timeout(10000)
                .then(function () {
                  return userState.reloadSelectedCompany();
                }).then(function() {
                  factory.purchase.completed = true;
                })
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
