(function (angular) {

  'use strict';
  
  /*jshint camelcase: false */

  angular.module('risevision.apps.purchase')
    .factory('creditCardFactory', ['$rootScope', '$q', 'stripeService', 'userState',
      'userAuthFactory', 'billing', 'addressService',
      function ($rootScope, $q, stripeService, userState, userAuthFactory, billing, addressService) {
        var factory = {
          stripeElements: {}
        };

        var elementOptions = {
          style: {
            base: {
              backgroundColor: '#FFF',
              color: '#020620',
              fontFamily: 'Helvetica,Arial,sans-serif',
              fontSize: '14px',
              fontSmoothing: 'antialiased',
              fontWeight: 400,
              iconColor: '#020620',
              '::placeholder': {
                color: '#777',
              },
            },
            invalid: {
              iconColor: '#020620',
              color: '#020620',
            }
          },
        };

        var stripeElements = [
          'cardNumber',
          'cardExpiry',
          'cardCvc'
        ];

        var stripeElementSelectors = [
          '#new-card-number',
          '#new-card-expiry',
          '#new-card-cvc'
        ];

        factory.initStripeElements = function() {
          stripeService.initializeStripeElements(stripeElements, elementOptions)
            .then(function (elements) {
              elements.forEach(function (el, idx) {
                factory.stripeElements[stripeElements[idx]] = el;
                el.mount(stripeElementSelectors[idx]);

                el.on('blur', function () {
                  $rootScope.$digest();
                });

                el.on('change', function (event) {
                  var element = document.querySelector(stripeElementSelectors[idx]);

                  if (element) {
                    element.classList.add('dirty');
                  }

                  $rootScope.$digest();
                });
              });
            });  
        };

        factory.selectNewCreditCard = function() {
          factory.paymentMethods.selectedCard = factory.paymentMethods.newCreditCard;
        };

        var _loadCreditCards = function() {
          billing.getCreditCards({
            count: 40
          })
          .then(function(result) {
            factory.paymentMethods.existingCreditCards = result.items;
            
            if (result.items[0]) {
              factory.paymentMethods.selectedCard = result.items[0];
            }
          });
        };

        factory.initPaymentMethods = function(loadExistingCards) {
          factory.paymentMethods = {
            existingCreditCards: [],
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
            var element = factory.stripeElements.cardNumber;
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

        factory.authenticate3ds = function (intentSecret) {
          return stripeService.authenticate3ds(intentSecret)
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
