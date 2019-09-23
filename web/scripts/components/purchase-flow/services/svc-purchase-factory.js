(function (angular) {

  "use strict";
  angular.module("risevision.common.components.purchase-flow")
    .constant("RPP_ADDON_ID", "c4b368be86245bf9501baaa6e0b00df9719869fd")
    .factory("purchaseFactory", ["$rootScope", "$q", "$log", "$modal", "$templateCache", "$timeout",
      "userState", "storeService", "stripeService", "addressService", "contactService", "purchaseFlowTracker",
      "RPP_ADDON_ID",
      function ($rootScope, $q, $log, $modal, $templateCache, $timeout, userState,
        storeService, stripeService, addressService, contactService, purchaseFlowTracker, RPP_ADDON_ID) {
        var factory = {};

        // Stop spinner - workaround for spinner not rendering
        factory.loading = false;

        var _init = function (plan, isMonthly) {
          factory.purchase = {};

          factory.purchase.plan = angular.copy(plan);
          factory.purchase.plan.additionalDisplayLicenses = parseInt(plan.additionalDisplayLicenses) || 0;
          factory.purchase.plan.isMonthly = isMonthly;

          factory.purchase.billingAddress = addressService.copyAddress(userState.getCopyOfUserCompany());
          factory.purchase.shippingAddress = addressService.copyAddressFromShipTo(userState.getCopyOfSelectedCompany());

          factory.purchase.contact = contactService.copyContactObj(userState.getCopyOfProfile());
          factory.purchase.paymentMethods = {
            paymentMethod: "card",
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

          purchaseFlowTracker.trackProductAdded(factory.purchase.plan);
        };

        factory.showPurchaseModal = function (plan, isMonthly) {
          _init(plan, isMonthly);

          var modalInstance = $modal.open({
            template: $templateCache.get("partials/components/purchase-flow/purchase-modal.html"),
            controller: "PurchaseModalCtrl",
            size: "md",
            backdrop: "static"
          });

          return modalInstance.result;
        };

        factory.showTaxExemptionModal = function () {
          var modalInstance = $modal.open({
            template: $templateCache.get("partials/components/purchase-flow/tax-exemption.html"),
            controller: "TaxExemptionModalCtrl",
            size: "md",
            backdrop: "static"
          });

          return modalInstance.result.then(function (result) {
            factory.purchase.taxExemptionSent = result;
          });
        };

        var _validateCard = function (card, isNew) {
          card.validationErrors = stripeService.validateCard(card, isNew);

          if (!card.validationErrors || card.validationErrors.length > 0) {
            return false;
          }

          return true;
        };

        factory.validatePaymentMethod = function () {
          var paymentMethods = factory.purchase.paymentMethods;
          var deferred = $q.defer();

          if (paymentMethods.paymentMethod === "invoice") {
            // TODO: Check Invoice credit (?)
            deferred.resolve();
          } else if (paymentMethods.paymentMethod === "card") {
            if (!paymentMethods.selectedCard.isNew) {
              if (_validateCard(paymentMethods.selectedCard, false)) {
                // Existing Card selected
                deferred.resolve();
              } else {
                deferred.reject();
              }
            } else {
              if (_validateCard(paymentMethods.newCreditCard, true)) {
                var address = paymentMethods.newCreditCard.address;
                if (paymentMethods.newCreditCard.useBillingAddress) {
                  address = paymentMethods.newCreditCard.billingAddress;
                }

                factory.loading = true;

                return stripeService.createToken(paymentMethods.newCreditCard, address)
                  .then(function (response) {
                    paymentMethods.newCreditCard.id = response.id;
                    paymentMethods.newCreditCard.last4 = response.card.last4;
                    paymentMethods.newCreditCard.cardType = response.card.type;
                  })
                  .finally(function () {
                    factory.loading = false;
                  });
              } else {
                deferred.reject();
              }
            }
          }
          return deferred.promise;
        };

        var _getBillingPeriod = function () {
          return factory.purchase.plan.isMonthly ? "01m" : "01y";
        };

        var _getCurrency = function () {
          return (factory.purchase.billingAddress.country === "CA") ? "cad" : "usd";
        };

        var _getChargebeePlanId = function () {
          return factory.purchase.plan.productCode + "-" + _getCurrency() + _getBillingPeriod();
        };

        var _getChargebeeAddonId = function () {
          return RPP_ADDON_ID + "-" + _getCurrency() + _getBillingPeriod() +
            factory.purchase.plan.productCode.substring(0, 3);
        };

        factory.getEstimate = function () {
          factory.purchase.estimate = {
            currency: _getCurrency()
          };

          factory.loading = true;

          return storeService.calculateTaxes(factory.purchase.billingAddress.id, _getChargebeePlanId(),
              factory.purchase.plan.displays,
              _getChargebeeAddonId(),
              factory.purchase.plan.additionalDisplayLicenses, factory.purchase.shippingAddress)
            .then(function (result) {
              var estimate = factory.purchase.estimate;

              estimate.taxesCalculated = true;
              estimate.taxes = result.taxes || [];
              estimate.total = result.total;
              estimate.subTotal = result.subTotal;
              estimate.couponAmount = result.couponAmount;
              estimate.totalTax = result.totalTax;
              estimate.shippingTotal = result.shippingTotal;

              purchaseFlowTracker.trackPlaceOrderClicked(estimate);
            })
            .catch(function (result) {
              factory.purchase.estimate.estimateError = result && result.message ? result.message :
                "An unexpected error has occurred. Please try again.";
            })
            .finally(function () {
              factory.loading = false;
            });
        };

        var _getOrderAsJson = function () {
          //clean up items
          var newItems = [{
            id: _getChargebeePlanId(),
            qty: factory.purchase.plan.displays
          }, {
            id: _getChargebeeAddonId(),
            qty: factory.purchase.plan.additionalDisplayLicenses
          }];

          var card = factory.purchase.paymentMethods.selectedCard;
          var cardData = factory.purchase.paymentMethods.paymentMethod === "invoice" ? null : {
            cardId: card.id,
            isDefault: card.isDefault ? true : false
          };

          var obj = {
            billTo: addressService.copyAddress(factory.purchase.billingAddress),
            shipTo: addressService.copyAddress(factory.purchase.shippingAddress),
            items: newItems,
            purchaseOrderNumber: factory.purchase.paymentMethods.purchaseOrderNumber,
            card: cardData
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

              purchaseFlowTracker.trackOrderPayNowClicked(factory.purchase.estimate);

              $timeout(10000)
                .then(function () {
                  return userState.reloadSelectedCompany();
                })
                .then(function () {
                  $rootScope.$emit("risevision.company.trial.started");
                })
                .catch(function (err) {
                  $log.debug("Failed to reload company", err);
                })
                .finally(function () {
                  factory.purchase.reloadingCompany = false;
                });
            })
            .catch(function (result) {
              factory.purchase.checkoutError = result && result.message ? result.message :
                "There was an unknown error with the payment.";
            })
            .finally(function () {
              factory.loading = false;
            });
        };

        return factory;
      }
    ]);

})(angular);
