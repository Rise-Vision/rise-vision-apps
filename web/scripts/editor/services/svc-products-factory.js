'use strict';

angular.module('risevision.editor.services')
  .constant('TEMPLATES_TYPE', 'Templates')
  .constant('UNLISTED_STORE_PRODUCTS', [{
    'productId': '288',
    'productOrderWeight': 17,
    'name': 'Embedded Presentation',
    'descriptionShort': 'Get Embedded Presentations as part of our Enterprise Plan',
    'descriptionLong': '<br>\n<br>\n<a href=\'https://store.risevision.com/product/301/enterprise-plan\'>Get Embedded Presentations as part of our Enterprise Plan</a>',
    'detailImageUrls': [
      'https://s3.amazonaws.com/Store-Products/Rise-Vision/embedded-presentations-1280x960.png'
    ],
    'imageUrl': 'https://s3.amazonaws.com/Store-Products/Rise-Vision/embedded-presentations-640x480.jpg',
    'paymentTerms': 'Subscription',
    'trialPeriod': 14,
    'productCode': 'd3a418f1a3acaed42cf452fefb1eaed198a1c620'
  }])
  .factory('productsFactory', ['$q', '$filter', 'store', 'subscriptionStatusFactory', 'TEMPLATES_TYPE',
    'UNLISTED_STORE_PRODUCTS',
    function ($q, $filter, store, subscriptionStatusFactory, TEMPLATES_TYPE, UNLISTED_STORE_PRODUCTS) {
      var factory = {};

      factory.isUnlistedProduct = function (productCode) {
        return !!_.find(UNLISTED_STORE_PRODUCTS, {
          productCode: productCode
        });
      };

      var _getUnlistedProducts = function () {
        var productCodes = _.map(UNLISTED_STORE_PRODUCTS, 'productCode');

        return subscriptionStatusFactory.checkProductCodes(productCodes)
          .then(function (statusItems) {
            return _.filter(UNLISTED_STORE_PRODUCTS, function (product) {
              var statusItem = _.find(statusItems, {
                pc: product.productCode
              });
              return !statusItem || statusItem.isSubscribed;
            });
          });
      };

      factory.loadProducts = function (search, cursor) {
        var unlistedProducts = [];
        if (search && search.category !== TEMPLATES_TYPE) {
          unlistedProducts = _getUnlistedProducts();
        }

        return $q.all([store.product.list(search, cursor), unlistedProducts])
          .then(function (results) {
            var filteredUnlistedProducts = search ? $filter('filter')(results[1], search.query) : results[1];

            _.each(filteredUnlistedProducts, function (product) {
              if (!results[0].items) {
                results[0].items = [product];
              } else if (results[0].items.length > product.productOrderWeight) {
                results[0].items.splice(product.productOrderWeight, 0, product);
              } else {
                results[0].items.push(product);
              }
            });

            return results[0];
          });
      };

      return factory;
    }
  ]);
