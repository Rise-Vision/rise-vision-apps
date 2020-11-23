'use strict';

angular.module('risevision.apps.purchase')
  .directive('paymentMethods', ['$templateCache', 'purchaseFactory', 'creditCardFactory',
    function ($templateCache, purchaseFactory, creditCardFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-payment-methods.html'),
        link: function ($scope) {
          $scope.paymentMethods = purchaseFactory.purchase.paymentMethods;
          $scope.contactEmail = purchaseFactory.purchase.contact.email;

          $scope.purchase = purchaseFactory.purchase;
          $scope.creditCardFactory = creditCardFactory;
        }
      };
    }
  ]);
