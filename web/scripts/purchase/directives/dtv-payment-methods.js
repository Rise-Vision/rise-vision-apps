'use strict';

angular.module('risevision.apps.purchase')
  .directive('paymentMethods', ['$templateCache', 'purchaseFactory',
    function ($templateCache, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-payment-methods.html'),
        link: function ($scope) {
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

          purchaseFactory.initializeStripeElements(stripeElements)
            .then(function (elements) {
              elements.forEach(function (el, idx) {
                $scope[stripeElements[idx]] = el;
                el.mount(stripeElementSelectors[idx]);
              });
            });

          $scope.getCardDescription = function (card) {
            return '***-' + card.last4 + ', ' + card.cardType + (card.isDefault ? ' (default)' : '');
          };

        }
      };
    }
  ]);
