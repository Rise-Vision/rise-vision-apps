(function (angular) {

  'use strict';

  angular.module('risevision.apps.purchase')
    .factory('purchaseLicensesFactory', ['$rootScope', '$q', '$log', '$timeout', 'userState',
      'currentPlanFactory', 'storeService', 'addressService', 'creditCardFactory', 'purchaseFlowTracker',
      function ($rootScope, $q, $log, $timeout, userState, currentPlanFactory, storeService, addressService,
        creditCardFactory, purchaseFlowTracker) {
        var factory = {};
        factory.userEmail = userState.getUserEmail();

        factory.init = function () {
          _clearMessages();

          factory.purchase = {};
          factory.purchase.completed = false;
          factory.purchase.displayCount = 1;
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

        // var _getTrackingProperties = function () {
        //   return {
        //     displaysCount: factory.purchase.plan.displays,
        //     paymentTerm: factory.purchase.plan.isMonthly ? 'monthly' : 'yearly',
        //     paymentMethod: creditCardFactory.paymentMethods.paymentMethod,
        //     discount: factory.purchase.estimate.couponAmount,
        //     subscriptionPlan: factory.purchase.plan.name,
        //     currency: factory.purchase.estimate.currency,
        //     revenueTotal: factory.purchase.estimate.total
        //   };
        // };

        var _clearMessages = function () {
          factory.loading = false;

          factory.errorMessage = '';
          factory.apiError = '';
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
              // purchaseFlowTracker.trackOrderPayNowClicked(_getTrackingProperties());

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
