'use strict';

angular.module('risevision.editor.services')
  .factory('subscriptionStatusFactory', ['$q', '$log', 'store',
    function ($q, $log, store) {
      var factory = {};

      var _statusItems = [];

      var _getStatusItemCached = function (productCode) {
        var cachedItem = _.find(_statusItems, {
          pc: productCode
        });
        return cachedItem;
      };

      var _updateStatusItemCache = function (newStatusItem) {
        if (!_getStatusItemCached(newStatusItem.pc)) {
          _statusItems.push(newStatusItem);
        }
      };

      factory.checkProductCode = function (productCode) {
        return factory.checkProductCodes([productCode]).then(function (
          statusItems) {
          if (statusItems && statusItems[0]) {
            return statusItems[0];
          }
          return null;
        });
      };

      var _isSubscribed = function (subscriptionStatus) {
        switch (subscriptionStatus) {
        case 'On Trial':
        case 'Subscribed':
          return true;
        case 'Not Subscribed':
        case 'Trial Expired':
        case 'Cancelled':
        case 'Suspended':
        case 'Product Not Found':
        case 'Company Not Found':
        case 'Error':
          return false;
        default:
          return true;
        }
      };

      factory.checkProductCodes = function (productCodes) {
        var deferred = $q.defer();

        var cachedItems = [];

        for (var i = 0; i < productCodes.length; i++) {
          var cachedItem = _getStatusItemCached(productCodes[i]);
          if (cachedItem) {
            cachedItems.push(cachedItem);
          }
        }
        if (cachedItems.length === productCodes.length) {
          deferred.resolve(cachedItems);
        } else {
          store.product.status(productCodes).then(function (result) {
              if (result && result.items) {
                for (var i = 0; i < result.items.length; i++) {
                  var statusItem = result.items[i];
                  statusItem.isSubscribed = _isSubscribed(statusItem.status);
                  _updateStatusItemCache(statusItem);
                }
                deferred.resolve(result.items);
              } else {
                deferred.resolve([]);
              }
            })
            .then(null, function (e) {
              console.error('Failed to get status of products.', e);
              deferred.reject(e);
            });
        }
        return deferred.promise;
      };

      return factory;
    }
  ])
  .value('TEMPLATE_LIBRARY_PRODUCT_CODE', '61dd6aa64152a228522ddf5950e5abb526416f27')
  .factory('checkTemplateAccess', ['storeAuthorization', 'TEMPLATE_LIBRARY_PRODUCT_CODE',
    function (storeAuthorization, TEMPLATE_LIBRARY_PRODUCT_CODE) {
      return function (templateCode) {
        return storeAuthorization.check(TEMPLATE_LIBRARY_PRODUCT_CODE)
          .catch(function () {
            return storeAuthorization.check(templateCode);
          });
      };
    }
  ]);
