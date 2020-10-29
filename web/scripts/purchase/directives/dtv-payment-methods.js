'use strict';

angular.module('risevision.apps.purchase')
  .directive('paymentMethods', ['$templateCache', 'purchaseFactory', 'stripeService',
    function ($templateCache, purchaseFactory, stripeService) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-payment-methods.html'),
        link: function ($scope) {
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

          $scope.paymentMethods = purchaseFactory.purchase.paymentMethods;
          $scope.contactEmail = purchaseFactory.purchase.contact.email;

          $scope.purchase = purchaseFactory.purchase;
          $scope.showTaxExemptionModal = purchaseFactory.showTaxExemptionModal;

          $scope.$watch('paymentMethods.paymentMethod', function() {
            if ($scope.paymentMethods.paymentMethod === 'card') {
              stripeService.initializeStripeElements(stripeElements, elementOptions)
                .then(function (elements) {
                  elements.forEach(function (el, idx) {
                    $scope[stripeElements[idx]] = el;
                    el.mount(stripeElementSelectors[idx]);

                    el.on('blur', function() {
                      $scope.$digest();
                    });

                    el.on('change', function(event) {
                      var element = document.querySelector(stripeElementSelectors[idx]);

                      if (element) {                        
                        element.classList.add('dirty');
                      }

                      $scope.$digest();
                    });
                  });
                });
            }
          });

          $scope.getCardDescription = function (card) {
            return '***-' + card.last4 + ', ' + card.cardType + (card.isDefault ? ' (default)' : '');
          };

          $scope.stripeElementError = function (elementId) {
            var element = document.getElementById(elementId);

            if (!element) {
              return false;
            } else if ($scope.form.paymentMethodsForm.$submitted || element.className.indexOf('dirty') !== -1) {
              return element.className.indexOf('StripeElement--invalid') !== -1 || 
                element.className.indexOf('StripeElement--empty') !== -1;
            }
          };

        }
      };
    }
  ]);
