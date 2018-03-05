'use strict';

/*jshint camelcase: false */

angular.module('risevision.editor.services')
  .value('TWITTER_WIDGET_PRODUCT', {
     "productId": "2078",
     "name": "Twitter Widget",
     "descriptionShort": "Show a Twitter feed on your display.",
     "descriptionLong": "Show a Twitter feed on your display with this easy to use Widget. The Twitter Widget will display 25 recent Tweets and automatically fit based on your placeholder size.\n<br>\n<br>\nTo use the Twitter Widget you need a Twitter account and at least one Display with Rise Player Professional. The Twitter Widget is a premium Widget and only Rise Player Professional Displays will have access to it.",
     "detailImageUrls": [
      "https://s3.amazonaws.com/Rise-Images/Icons/twitter-widget-store-1920x1080.png"
     ],
     "imageUrl": "https://s3.amazonaws.com/Rise-Images/Icons/twitter-widget-store-558x332.png",
     "infoUrl": "none",
     "termsUrl": "none",
     "vendorId": "",
     "vendorName": "Rise Vision",
     "vendorUrl": "http://www.risevision.com/",
     "vendorEmail": "sales@risevision.com",
     "paymentTerms": "Free",
     "trialPeriod": 0,
     "discountApplies": false,
     "productTag": [
      "Content"
     ],
     "active": true,
     "pricing": [
      {
       "accountingId": "20080",
       "unit": "Free",
       "priceUSD": 0,
       "priceCAD": 0,
       "shippingPriceToUS": 0,
       "shippingPriceToCA": 0,
       "vendorProductId": "",
       "vendorLeadTime": "",
       "vendorDaysToCancel": 0,
       "vendorSaleAmountUSD": 0,
       "vendorSaleAmountCAD": 0,
       "vendorShippingCostToUS": 0,
       "vendorShippingCostToCA": 0
      }
     ],
     "revenueAccount": "",
     "costAccount": "",
     "productCode": "5abfaa9538f07224c12796937b9a0745d1cc46cc",
     "isExperimental": true,
     "hideAddButton": false,
     "rvaEntityId": "",
     "rvaEntityCompanyId": "",
     "displayType": "",
     "kind": "store#productItem"
    })
  .service('store', ['$q', '$log', 'storeAPILoader', 'userState', 'TWITTER_WIDGET_PRODUCT',
    function ($q, $log, storeAPILoader, userState, TWITTER_WIDGET_PRODUCT) {
      var service = {
        product: {
          status: function (productCodes) {
            var deferred = $q.defer();

            var obj = {
              'companyId': userState.getSelectedCompanyId(),
              'productCodes': productCodes
            };

            $log.debug('Store product status called with', obj);

            storeAPILoader().then(function (storeApi) {
                return storeApi.product.status(obj);
              })
              .then(function (resp) {
                $log.debug('status store products resp', resp);

                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to get status of products.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          list: function (search, cursor) {
            var deferred = $q.defer();

            var companyId = userState.getSelectedCompanyId();
            var category = search.category;

            var filterString = 'visibleTo:ALL';

            if (companyId) {
              filterString += ' OR visibleTo:' + companyId;
            }

            filterString = '(' + filterString + ')';
            filterString = filterString + ' AND (productTag:' + category +
              ')';

            if (search.rvaEntityId) {
              filterString += ' AND (rvaEntityId:' + search.rvaEntityId +
                ')';
            }

            if (search.query && search.query.length) {
              filterString += ' AND ' + search.query;
            }

            var obj = {
              'companyId': userState.getSelectedCompanyId(),
              'search': filterString,
              'cursor': cursor,
              'count': search.count,
              'sort': 'defaultOrderWeight ASC'
            };

            $log.debug('Store product list called with', obj);

            storeAPILoader().then(function (storeApi) {
                return storeApi.product.list(obj);
              })
              .then(function (resp) {
                // Hardcoding twitter widget product here so it only show on apps and not on RVA
                // Trello card https://trello.com/c/ncK9K9if/4878-add-twitter-widget-to-app-store-products-list-2
                if (category === 'Content' && resp && resp.result && resp.result.items && Array.isArray(resp.result.items)) {
                  resp.result.items.unshift(TWITTER_WIDGET_PRODUCT);
                }

                $log.debug('list store products resp', resp);

                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to get list of products.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        }
      };

      return service;
    }
  ]);
