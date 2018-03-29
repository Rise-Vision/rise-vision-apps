'use strict';

angular.module('risevision.editor.services')
  .factory('productsFactory', ['$q', 'store', 'subscriptionStatusFactory',
    'EMBEDDED_PRESENTATIONS_CODE',
    function ($q, store, subscriptionStatusFactory, EMBEDDED_PRESENTATIONS_CODE) {
      var factory = {};
      var unlistedProducts = [EMBEDDED_PRESENTATIONS_CODE];

      factory.isUnlistedProduct = function(productCode) {
        return unlistedProducts.indexOf(productCode) !== -1;
      };

      var _getUnlistedProducts = function() {
        return subscriptionStatusFactory.checkProductCodes(unlistedProducts)
          .then(function (statusItems) {
            return _.filter(statusItems, function(item) {
              return !item.isSubscribed;
            });
          });
      };

      factory.loadProducts = function (search, cursor) {
        return $q.all([store.product.list(search, cursor), _getUnlistedProducts()])
          .then(function(results) {
            var filteredItems = _.filter(results[0].items, function(product) {
              return !_.find(results[1], {
                pc: product.productCode
              });
            });

            results[0].items = filteredItems;

            return results[0];
          });
      };

      return factory;
    }
  ]);
