'use strict';

angular.module('risevision.editor.services')
  .constant('TEMPLATES_TYPE', 'Templates')
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
