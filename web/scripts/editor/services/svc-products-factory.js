'use strict';

angular.module('risevision.editor.services')
  .constant('TEMPLATES_TYPE', 'Templates')
  .constant('HTML_TEMPLATE_TYPE', 'HTMLTemplates')
  .constant('UNLISTED_STORE_PRODUCT', {
    'productId': '111',
    'productOrderWeight': 5,
    'name': 'U.S. Stocks - Streaming Watchlist',
    'descriptionShort': 'Create a streaming watchlist of up to 30 U.S. equities.',
    'imageUrl': 'https://s3.amazonaws.com/Store-Products/StockTrak/widget_918_image_edit1.png',
    'paymentTerms': 'Subscription',
    'trialPeriod': 7,
    'productCode': '7949cc2b1ab2b77f2ce48d23c5aae55b9d4d27d6'
  })
  .factory('productsFactory', ['$q', '$filter', 'widgetUtils', 'storeProduct', 'storeAuthorization',
    'TEMPLATES_TYPE', 'UNLISTED_STORE_PRODUCT',
    function ($q, $filter, widgetUtils, storeProduct, storeAuthorization, 
      TEMPLATES_TYPE, UNLISTED_STORE_PRODUCT) {
      var factory = {};

      var professionalWidgets = widgetUtils.getProfessionalWidgets();

      var _getUnlistedProducts = function () {
        var productCode = UNLISTED_STORE_PRODUCT.productCode;

        return storeAuthorization.check(productCode)
          .then(function () {
            return [UNLISTED_STORE_PRODUCT];
          })
          .catch(function() {
            return [];
          });
      };

      var _filter = function(results, search) {
        if (search && search.query) {
          return $filter('filter')(results, search.query);
        } else {
          return results;
        }
      };

      factory.loadProducts = function (search, cursor) {
        var unlistedProducts = [];
        var filteredProfessionalWidgets = [];
        if (search && search.category !== TEMPLATES_TYPE) {
          unlistedProducts = _getUnlistedProducts();
          filteredProfessionalWidgets = _filter(professionalWidgets, search);
        }

        return $q.all([storeProduct.list(search, cursor), unlistedProducts])
          .then(function (results) {
            var dummyProductCode = 1;
            var filteredStoreProducts = results[0].items || [];
            var filteredUnlistedProducts = _filter(results[1], search);
            var result = {
              items: []
            };

            result.items = _.union(filteredProfessionalWidgets, filteredUnlistedProducts, filteredStoreProducts);
            result.items = _.uniqBy(result.items, function(product) {
              return product.productCode || dummyProductCode++;
            });

            return result;
          });
      };

      return factory;
    }
  ]);
