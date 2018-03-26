'use strict';

var NG_HIDE_CLASS = 'ng-hide';

angular.module('risevision.editor.directives')
  .directive('unlistStoreProduct', ['subscriptionStatusFactory', 'gadgetFactory',
    function (subscriptionStatusFactory, gadgetFactory) {
      return {
        restrict: 'A',
        scope: {
          unlistStoreProduct: '='
        },
        link: function ($scope, $element) {
          var productCode = $scope.unlistStoreProduct.productCode;

          if (!productCode || !gadgetFactory.isUnlistedProduct(productCode)) {
            return;
          }

          subscriptionStatusFactory.checkProductCodes([productCode])
            .then(function(products) {
              if (!products || !products.length) {
                return;
              }

              var product = _.find(products, { pc: productCode });
              
              if (product && !product.isSubscribed) {
                $element.addClass(NG_HIDE_CLASS);
              }
            });
        }
      };
    }
  ]);
