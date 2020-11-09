(function (angular) {

  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.apps.purchase')
    .constant('RPP_ADDON_ID', 'c4b368be86245bf9501baaa6e0b00df9719869fd')
    .factory('purchaseFactory', ['$rootScope', '$q', '$log', '$state', '$modal', '$templateCache', '$timeout',
      'userState', 'storeService', 'stripeService', 'addressService', 'contactService', 'purchaseFlowTracker',
      'RPP_ADDON_ID', 'PLANS_LIST',
      function ($rootScope, $q, $log, $state, $modal, $templateCache, $timeout, userState,
        storeService, stripeService, addressService, contactService, purchaseFlowTracker, RPP_ADDON_ID, PLANS_LIST) {
        var factory = {};

        // Stop spinner - workaround for spinner not rendering
        factory.loading = false;

        factory.init = function () {
          var volumePlan = _.find(PLANS_LIST, {
            type: 'volume'
          });

          var plan = {
            name: '5 Display Licenses (Yearly)',
            productId: volumePlan.productId,
            productCode: volumePlan.productCode,
            displays: 5,
            isMonthly: false,
            additionalDisplayLicenses: 0,
            yearly: {
              billAmount: volumePlan.yearly.billAmount
            },
            monthly: {
              billAmount: volumePlan.monthly.billAmount
            }
          };

          factory.purchase = {};
          factory.purchase.plan = plan;
          factory.purchase.couponCode = '';

          factory.purchase.billingAddress = addressService.copyAddress(userState.getCopyOfSelectedCompany());

          factory.purchase.contact = contactService.copyContactObj(userState.getCopyOfProfile());
          factory.purchase.paymentMethods = {
            paymentMethod: 'card',
            existingCreditCards: [],
            newCreditCard: {
              isNew: true,
              address: {},
              useBillingAddress: true,
              billingAddress: factory.purchase.billingAddress
            }
          };

          var invoiceDate = new Date();
          invoiceDate.setDate(invoiceDate.getDate() + 30);
          factory.purchase.paymentMethods.invoiceDate = invoiceDate;

          // Alpha Release - Select New Card by default
          factory.purchase.paymentMethods.selectedCard = factory.purchase.paymentMethods.newCreditCard;
          factory.purchase.estimate = {};

        };

        factory.updatePlan = function (displays, isMonthly, total) {
          var period = !isMonthly ? 'Yearly' : 'Monthly';
          var s = displays > 1 ? 's' : '';
          var planName = '' + displays + ' Display License' + s + ' (' + period + ')';

          factory.purchase.plan.name = planName;
          factory.purchase.plan.displays = displays;
          factory.purchase.plan.isMonthly = isMonthly;
          if (isMonthly) {
            factory.purchase.plan.monthly.billAmount = total;         
          } else {
            factory.purchase.plan.yearly.billAmount = total;
          }

          purchaseFlowTracker.trackProductAdded(factory.purchase.plan);
        };

        factory.showTaxExemptionModal = function () {
          var modalInstance = $modal.open({
            template: $templateCache.get('partials/purchase/tax-exemption.html'),
            controller: 'TaxExemptionModalCtrl',
            windowClass: 'madero-style',
            size: 'md',
            backdrop: 'static'
          });

          return modalInstance.result.then(function (result) {
            factory.purchase.taxExemptionSent = result;
          });
        };

        factory.authenticate3ds = function (intentSecret) {
          return stripeService.authenticate3ds(intentSecret)
            .then(function (result) {
              if (result.error) {
                factory.purchase.checkoutError = result.error;
                return $q.reject(result.error);
              }
            })
            .catch(function (error) {
              console.log(error);
              factory.purchase.checkoutError =
                'Something went wrong, please retry or contact support@risevision.com';
              return $q.reject(error);
            });
        };

        factory.preparePaymentIntent = function () {
          var paymentMethods = factory.purchase.paymentMethods;

          if (paymentMethods.paymentMethod === 'invoice') {
            return $q.resolve();
          } else if (paymentMethods.paymentMethod === 'card') {
            var jsonData = _getOrderAsJson();

            factory.loading = true;

            return storeService.preparePurchase(jsonData)
              .then(function (response) {
                if (response.error) {
                  factory.purchase.checkoutError = response.error;
                  return $q.reject(response.error);
                } else {
                  paymentMethods.intentResponse = response;
                  if (response.authenticationRequired) {
                    return factory.authenticate3ds(response.intentSecret);
                  } else {
                    return $q.resolve();
                  }
                }
              })
              .catch(function (error) {
                factory.purchase.checkoutError = error.message || 'Something went wrong, please retry';
                return $q.reject(error);
              })
              .finally(function() {
                factory.loading = false;
              });
          }
        };

        factory.validatePaymentMethod = function (element) {
          var paymentMethods = factory.purchase.paymentMethods;

          factory.purchase.checkoutError = null;

          if (paymentMethods.paymentMethod === 'invoice') {
            // TODO: Check Invoice credit (?)
            return $q.resolve();
          } else if (paymentMethods.paymentMethod === 'card') {
            if (!paymentMethods.selectedCard.isNew) {
              return $q.resolve();
            } else {
              var address = paymentMethods.newCreditCard && paymentMethods.newCreditCard.address;
              if (paymentMethods.newCreditCard && paymentMethods.newCreditCard.useBillingAddress) {
                address = paymentMethods.newCreditCard.billingAddress;
              }

              var details = {
                billing_details: {
                  name: paymentMethods.newCreditCard && paymentMethods.newCreditCard.name,
                  address: address ? {
                    city: address.city,
                    country: address.country,
                    postal_code: address.postalCode,
                    state: address.province
                  } : {}
                }
              };

              factory.loading = true;

              return stripeService.createPaymentMethod('card', element, details)
                .then(function (response) {
                  if (response.error) {
                    return $q.reject(response.error);
                  } else {
                    paymentMethods.paymentMethodResponse = response;
                    return $q.resolve();
                  }
                })
                .finally(function() {
                  factory.loading = false;
                });
            }
          }
        };

        var _getBillingPeriod = function () {
          return factory.purchase.plan.isMonthly ? '01m' : '01y';
        };

        var _getCurrency = function () {
          return (factory.purchase.billingAddress.country === 'CA') ? 'cad' : 'usd';
        };

        var _getChargebeePlanId = function () {
          return factory.purchase.plan.productCode + '-' + _getCurrency() + _getBillingPeriod();
        };

        var _getChargebeeAddonId = function () {
          return RPP_ADDON_ID + '-' + _getCurrency() + _getBillingPeriod() +
            factory.purchase.plan.productCode.substring(0, 3);
        };

        var _getTrackingProperties = function () {
          return {
            displaysCount: factory.purchase.plan.displays,
            paymentTerm: factory.purchase.plan.isMonthly ? 'monthly' : 'yearly',
            paymentMethod: factory.purchase.paymentMethods.paymentMethod,
            discount: factory.purchase.estimate.couponAmount,
            subscriptionPlan: factory.purchase.plan.name,
            currency: factory.purchase.estimate.currency,
            revenueTotal: factory.purchase.estimate.total
          };
        };

        factory.getEstimate = function () {
          factory.loading = true;

          return storeService.calculateTaxes(factory.purchase.billingAddress.id, _getChargebeePlanId(),
              factory.purchase.plan.displays,
              _getChargebeeAddonId(),
              factory.purchase.plan.additionalDisplayLicenses, factory.purchase.billingAddress, factory.purchase
              .couponCode)
            .then(function (result) {
              var estimate = {};

              estimate.currency = _getCurrency();
              estimate.taxesCalculated = true;
              estimate.taxes = result.taxes || [];
              estimate.total = result.total;
              estimate.subTotal = result.subTotal;
              estimate.couponAmount = result.couponAmount;
              estimate.totalTax = result.totalTax;
              estimate.shippingTotal = result.shippingTotal;

              factory.purchase.estimate = estimate;

              purchaseFlowTracker.trackPlaceOrderClicked(_getTrackingProperties());
            })
            .catch(function (result) {
              factory.purchase.estimate.estimateError = result && result.message ? result.message :
                'An unexpected error has occurred. Please try again.';
            })
            .finally(function () {
              factory.loading = false;
            });
        };

        var _getOrderAsJson = function () {
          //clean up items
          var paymentMethods = factory.purchase.paymentMethods;
          var newItems = [{
            id: _getChargebeePlanId(),
            qty: factory.purchase.plan.displays
          }, {
            id: _getChargebeeAddonId(),
            qty: factory.purchase.plan.additionalDisplayLicenses
          }];

          var card = factory.purchase.paymentMethods.selectedCard;
          var cardData = paymentMethods.paymentMethod === 'invoice' ? null : {
            cardId: card.id,
            intentId: paymentMethods.intentResponse ? paymentMethods.intentResponse.intentId : null,
            isDefault: card.isDefault ? true : false
          };

          var obj = {
            billTo: addressService.copyAddress(factory.purchase.billingAddress),
            shipTo: addressService.copyAddress(factory.purchase.billingAddress),
            couponCode: factory.purchase.couponCode,
            items: newItems,
            purchaseOrderNumber: paymentMethods.purchaseOrderNumber,
            card: cardData,
            paymentMethodId: paymentMethods.paymentMethodResponse ?
              paymentMethods.paymentMethodResponse.paymentMethod.id : null
          };

          return JSON.stringify(obj);
        };

        factory.completePayment = function () {
          var jsonData = _getOrderAsJson();

          factory.purchase.checkoutError = null;
          factory.loading = true;

          return storeService.purchase(jsonData)
            .then(function () {
              factory.purchase.reloadingCompany = true;

              purchaseFlowTracker.trackOrderPayNowClicked(_getTrackingProperties());

              $timeout(10000)
                .then(function () {
                  return userState.reloadSelectedCompany();
                })
                .then(function () {
                  $rootScope.$emit('risevision.company.planStarted');
                })
                .catch(function (err) {
                  $log.debug('Failed to reload company', err);
                })
                .finally(function () {
                  factory.purchase.reloadingCompany = false;
                });
            })
            .catch(function (result) {
              factory.purchase.checkoutError = result && result.message ? result.message :
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
