'use strict';

angular.module('risevision.common.components.purchase-flow')
  .directive('paymentMethods', ['$templateCache', 'purchaseFactory',
    function ($templateCache, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/components/purchase-flow/checkout-payment-methods.html'),
        link: function ($scope) {
          $scope.paymentMethods = purchaseFactory.purchase.paymentMethods;
          $scope.contactEmail = purchaseFactory.purchase.contact.email;

          $scope.purchase = purchaseFactory.purchase;
          $scope.showTaxExemptionModal = purchaseFactory.showTaxExemptionModal;

          $scope.getCardDescription = function (card) {
            return '***-' + card.last4 + ', ' + card.cardType + (card.isDefault ? ' (default)' : '');
          };

        }
      };
    }
  ]);
