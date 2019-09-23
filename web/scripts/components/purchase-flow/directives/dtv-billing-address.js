'use strict';

angular.module('risevision.common.components.purchase-flow')
  .directive('billingAddress', ['$templateCache', 'purchaseFactory',
    function ($templateCache, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/components/purchase-flow/checkout-billing-address.html'),
        link: function ($scope) {
          $scope.billingAddress = purchaseFactory.purchase.billingAddress;
          $scope.contact = purchaseFactory.purchase.contact;
        }
      };
    }
  ]);
