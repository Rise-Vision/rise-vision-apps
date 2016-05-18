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

      factory.checkProductCode = function(productCode) {
        return factory.checkProductCodes([productCode]).then(function(statusItems){
          if (statusItems && statusItems[0]) {
            return statusItems[0]; 
          }
          return null;
        });
      }

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
                  _updateStatusItemCache(statusItem);
                }
                deferred.resolve(result.items);
              } else {
                deferred.resolve([]);
              }
            })
            .then(null, function (e) {
              $log.error('Failed to get status of products.', e);
              deferred.reject(e);
            });
        }
        return deferred.promise;
      };

      return factory;
    }
  ]);
