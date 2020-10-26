'use strict';

angular.module('risevision.apps.purchase')
  .directive('checkoutSuccess', ['$templateCache', 'purchaseFactory',
    function ($templateCache, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-success.html'),
        link: function ($scope) {
          $scope.purchase = purchaseFactory.purchase;
        }
      };
    }
  ]);
