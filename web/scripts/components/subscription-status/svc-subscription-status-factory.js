'use strict';

angular.module('risevision.common.components.subscription-status.service')
  .factory('subscriptionStatusFactory', ['$rootScope', '$q', '$log', 'subscriptionStatusService',
    function ($rootScope, $q, $log, subscriptionStatusService) {
      var factory = {};

      var _statusItems = [];

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _statusItems = [];
      });

      var _getStatusItemCached = function (productCode) {
        var cachedItem = _.find(_statusItems, {
          pc: productCode
        });
        return cachedItem;
      };

      var _updateStatusItemsCache = function (newStatusItems) {
        for (var i = 0; i < newStatusItems.length; i++) {
          var newStatusItem = newStatusItems[i];

          if (!_getStatusItemCached(newStatusItem.pc)) {
            _statusItems.push(newStatusItem);
          }
        }
      };

      factory.checkProductCode = function (productCode) {
        return factory.checkProductCodes([productCode])
          .then(function (statusItems) {
            if (statusItems && statusItems[0]) {
              return statusItems[0];
            }
            return null;
          });
      };

      factory.check = function (productCode) {
        return factory.checkProductCode(productCode)
          .then(function (statusItem) {
            if (statusItem.isSubscribed) {
              return $q.resolve(true);
            } else {
              return $q.reject(false);
            }
          });
      };

      factory.checkProductCodes = function (productCodes) {
        var cachedItems = [];

        for (var i = 0; i < productCodes.length; i++) {
          var cachedItem = _getStatusItemCached(productCodes[i]);
          if (cachedItem) {
            cachedItems.push(cachedItem);
          }
        }
        if (cachedItems.length === productCodes.length) {
          return $q.resolve(cachedItems);
        } else {
          return subscriptionStatusService.list(productCodes)
            .then(function (result) {
              _updateStatusItemsCache(result);

              return result;
            });
        }
      };

      return factory;
    }
  ]);
