'use strict';

angular.module('risevision.editor.services')
  .constant('UNLISTED_STORE_PRODUCTS', [
    {
    "productId": "288",
    'productOrderWeight': 17,
    "name": "Embedded Presentation",
    "descriptionShort": "Get Embedded Presentations as part of our Enterprise Plan",
    "descriptionLong": "<br>\n<br>\n<a href=\"https://store.risevision.com/product/301/enterprise-plan\">Get Embedded Presentations as part of our Enterprise Plan</a>",
    "detailImageUrls": [
    "https://s3.amazonaws.com/Store-Products/Rise-Vision/embedded-presentations-1280x960.png"
    ],
    // "detailVideoIds": [
    // "BD3M4uGheyk"
    // ],
    "imageUrl": "https://s3.amazonaws.com/Store-Products/Rise-Vision/embedded-presentations-640x480.jpg",
    // "infoUrl": "none",
    // "termsUrl": "none",
    // "vendorId": "",
    // "vendorName": "Rise Vision",
    // "vendorUrl": "http://www.risevision.com/",
    // "vendorEmail": "support@risevision.com",
    "paymentTerms": "Subscription",
    "trialPeriod": 14,
    // "discountApplies": false,
    // "productTag": [
    // "Content",
    // "Apps",
    // "embeddedpresentationbundles"
    // ],
    // "active": true,
    // "pricing": [
    // {
    //  "accountingId": "100296",
    //  "unit": "per Company per Month",
    //  "priceUSD": 9.0,
    //  "priceCAD": 9.0,
    //  "shippingPriceToUS": 0.0,
    //  "shippingPriceToCA": 0.0,
    //  "vendorProductId": "",
    //  "vendorLeadTime": "",
    //  "vendorDaysToCancel": 0,
    //  "vendorSaleAmountUSD": 0.0,
    //  "vendorSaleAmountCAD": 0.0,
    //  "vendorShippingCostToUS": 0.0,
    //  "vendorShippingCostToCA": 0.0
    // },
    // {
    //  "accountingId": "100297",
    //  "unit": "per Company per Year",
    //  "priceUSD": 99.0,
    //  "priceCAD": 99.0,
    //  "shippingPriceToUS": 0.0,
    //  "shippingPriceToCA": 0.0,
    //  "vendorProductId": "",
    //  "vendorLeadTime": "",
    //  "vendorDaysToCancel": 0,
    //  "vendorSaleAmountUSD": 0.0,
    //  "vendorSaleAmountCAD": 0.0,
    //  "vendorShippingCostToUS": 0.0,
    //  "vendorShippingCostToCA": 0.0
    // }
    // ],
    // "revenueAccount": "4901",
    // "costAccount": "5901",
    "productCode": "d3a418f1a3acaed42cf452fefb1eaed198a1c620",
    // "isExperimental": false,
    // "hideAddButton": true,
    // "rvaEntityId": "",
    // "rvaEntityCompanyId": "",
    // "displayType": "video"
    }
  ])
  .factory('productsFactory', ['$q', '$filter', 'store', 'subscriptionStatusFactory',
    'UNLISTED_STORE_PRODUCTS',
    function ($q, $filter, store, subscriptionStatusFactory, UNLISTED_STORE_PRODUCTS) {
      var factory = {};

      factory.isUnlistedProduct = function(productCode) {
        return !!_.find(UNLISTED_STORE_PRODUCTS, { productCode: productCode });
      };

      var _getUnlistedProducts = function() {
        var productCodes = _.map(UNLISTED_STORE_PRODUCTS, "productCode");

        return subscriptionStatusFactory.checkProductCodes(productCodes)
          .then(function (statusItems) {
            return _.filter(UNLISTED_STORE_PRODUCTS, function(product) {
              var statusItem = _.find(statusItems, { 
                pc: product.productCode
              });
              return !statusItem || statusItem.isSubscribed;
            });
          });
      };

      factory.loadProducts = function (search, cursor) {
        return $q.all([store.product.list(search, cursor), _getUnlistedProducts()])
          .then(function(results) {
            var unlistedProducts = search ? $filter('filter')(results[1], search.query) : results[1];

            _.each(unlistedProducts, function(product) {
              if (!results[0].items) {
                results[0].items = [ product ];
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
