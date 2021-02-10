'use strict';

angular.module('risevision.apps.purchase')
  .directive('billingAddress', ['$templateCache', 'purchaseFactory',
    function ($templateCache, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-billing-address.html'),
        link: function ($scope) {
          $scope.billingAddress = purchaseFactory.purchase.billingAddress;
          $scope.contact = purchaseFactory.purchase.contact;
        }
      };
    }
  ]);
