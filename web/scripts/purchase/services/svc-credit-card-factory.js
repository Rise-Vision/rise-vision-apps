(function (angular) {

  'use strict';
  
  /*jshint camelcase: false */

  angular.module('risevision.apps.purchase')
    .factory('creditCardFactory', ['$q', 'stripeService', 'userState',
      'userAuthFactory', 'paymentSourcesFactory', 'stripeElementsFactory', 'addressService',
      function ($q, stripeService, userState, userAuthFactory, paymentSourcesFactory,
        stripeElementsFactory, addressService) {
        var factory = {};

        factory.selectNewCreditCard = function() {
          factory.paymentMethods.selectedCard = factory.paymentMethods.newCreditCard;
        };

        var _loadCreditCards = function() {
          paymentSourcesFactory.init()
            .then(function() {
              if (paymentSourcesFactory.selectedCard) {
                factory.paymentMethods.selectedCard = paymentSourcesFactory.selectedCard;                
              }
            });
        };

        factory.initPaymentMethods = function(loadExistingCards) {
          factory.paymentMethods = {
            newCreditCard: {
              isNew: true,
              address: {},
              useBillingAddress: false
            }
          };

          // Select New Card by default
          factory.selectNewCreditCard();

          return userAuthFactory.authenticate()
            .then(function () {
              var company = userState.getCopyOfSelectedCompany();
              if (company.id) {
                factory.paymentMethods.newCreditCard.useBillingAddress = true;
                factory.paymentMethods.newCreditCard.billingAddress = addressService.copyAddress(company);

                if (loadExistingCards) {
                  _loadCreditCards();
                }
              }
            });
        };

        factory.validatePaymentMethod = function () {
          factory.paymentMethods.tokenError = null;

          if (!factory.paymentMethods.selectedCard.isNew) {
            return $q.resolve();
          } else {
            var element = stripeElementsFactory.stripeElements.cardNumber;
            var address = factory.paymentMethods.newCreditCard && factory.paymentMethods.newCreditCard.address;
            if (factory.paymentMethods.newCreditCard && factory.paymentMethods.newCreditCard.useBillingAddress) {
              address = factory.paymentMethods.newCreditCard.billingAddress;
            }

            var details = {
              billing_details: {
                name: factory.paymentMethods.newCreditCard && factory.paymentMethods.newCreditCard.name,
                address: address ? {
                  city: address.city,
                  country: address.country,
                  postal_code: address.postalCode,
                  state: address.province
                } : {}
              }
            };

            return stripeService.createPaymentMethod('card', element, details)
              .then(function (response) {
                if (response.error) {
                  factory.paymentMethods.tokenError = response.error.message;

                  return $q.reject(response.error);
                } else {
                  factory.paymentMethods.paymentMethodResponse = response;

                  return $q.resolve();
                }
              });
          }
        };

        factory.getPaymentMethodId = function () {
          if (factory.paymentMethods.paymentMethodResponse) {
            return factory.paymentMethods.paymentMethodResponse.paymentMethod.id;
          } else if (factory.paymentMethods.selectedCard && factory.paymentMethods.selectedCard.payment_source) {
            return factory.paymentMethods.selectedCard.payment_source.reference_id;
          } else {
            return null;
          }
        };

        factory.handleCardAction = function (intentSecret) {
          return stripeService.handleCardAction(intentSecret)
            .then(function (result) {
              if (result.error) {
                factory.paymentMethods.tokenError = result.error;
                return $q.reject(result.error);
              }
            })
            .catch(function (error) {
              console.log(error);
              factory.paymentMethods.tokenError =
                'Something went wrong, please retry or contact support@risevision.com';
              return $q.reject(error);
            });
        };

        factory.confirmCardSetup = function (intentSecret) {
          return stripeService.confirmCardSetup(intentSecret)
            .then(function (result) {
              if (result.error) {
                factory.paymentMethods.tokenError = result.error;
                return $q.reject(result.error);
              }
            })
            .catch(function (error) {
              console.log(error);
              factory.paymentMethods.tokenError =
                'Something went wrong, please retry or contact support@risevision.com';
              return $q.reject(error);
            });
        };

        return factory;
      }
    ]);

})(angular);
