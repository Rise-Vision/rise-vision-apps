'use strict';

angular.module('risevision.editor.services')
  .factory('gadgetFactory', ['$q', 'gadget', 'BaseList',
    'subscriptionStatusFactory', '$filter',
    function ($q, gadget, BaseList, subscriptionStatusFactory, $filter) {
      var factory = {};

      var _gadgets = [];
      factory.loadingGadget = false;
      factory.apiError = '';

      var _getGadgetCached = function (gadgetId) {
        var cachedGadget = _.find(_gadgets, {
          id: gadgetId
        });

        return cachedGadget;
      };

      var _updateGadgetCache = function (newGadget) {
        if (!_getGadgetCached(gadget.id)) {
          _gadgets.push(newGadget);
        }
      };

      factory.getGadget = function (gadgetId) {
        var deferred = $q.defer();
        var cachedGadget = _getGadgetCached(gadgetId);

        if (cachedGadget) {
          deferred.resolve(cachedGadget);
        } else {
          //show loading spinner
          factory.loadingGadget = true;

          gadget.get(gadgetId)
            .then(function (result) {
              _updateGadgetCache(result.item);

              deferred.resolve(result.item);
            })
            .then(null, function (e) {
              factory.apiError = e.message ? e.message : e.toString();

              deferred.reject();
            })
            .finally(function () {
              factory.loadingGadget = false;
            });
        }

        return deferred.promise;
      };

      var _getGadgetByProductCached = function (productCode) {
        var cachedGadget = _.find(_gadgets, {
          'productCode': productCode
        });

        return cachedGadget;
      };

      factory.getGadgetByProduct = function (productCode) {
        var deferred = $q.defer();
        var cachedGadget = _getGadgetByProductCached(productCode);

        if (cachedGadget) {
          deferred.resolve(cachedGadget);
        } else {
          //show loading spinner
          factory.loadingGadget = true;

          var search = new BaseList();
          search.productCodes = [productCode];

          gadget.list(search)
            .then(function (result) {
              if (result.items && result.items[0]) {
                _updateGadgetCache(result.items[0]);

                deferred.resolve(result.items[0]);
              } else {
                factory.apiError =
                  'No Gadgets found via the Product Code:' + productCode;

                deferred.reject();
              }
            })
            .then(null, function (e) {
              factory.apiError = e.message ? e.message : e.toString();

              deferred.reject();
            })
            .finally(function () {
              factory.loadingGadget = false;
            });
        }

        return deferred.promise;
      };

      factory.getGadgets = function (gadgetIds) {
        var deferred = $q.defer();

        var cachedGadgets = [];
        for (var i = 0; i < gadgetIds.length; i++) {
          var cachedGadget = _getGadgetCached(gadgetIds[i]);
          if (cachedGadget) {
            cachedGadgets.push(cachedGadget);
          }
        }
        if (cachedGadgets.length === gadgetIds.length) {
          deferred.resolve(cachedGadgets);
        } else {
          //show loading spinner
          factory.loadingGadget = true;

          gadget.list({
              ids: gadgetIds
            })
            .then(function (result) {
              if (result.items) {
                for (var i = 0; i < result.items.length; i++) {
                  _updateGadgetCache(result.items[i]);
                }
                deferred.resolve(result.items);
              } else {
                deferred.resolve([]);
              }
            })
            .then(null, function (e) {
              factory.apiError = e.message ? e.message : e.toString();
              deferred.reject();
            })
            .finally(function () {
              factory.loadingGadget = false;
            });
        }

        return deferred.promise;
      };

      factory.updateSubscriptionStatus = function (gadgetIds) {
        var deferred = $q.defer();

        factory.getGadgets(gadgetIds).then(function (gadgets) {
          var productCodeGadgetMap = {};
          for (var i = 0; i < gadgets.length; i++) {
            var gadget = gadgets[i];
            gadget.statusMessage = '';
            if (gadget.productCode) {
              productCodeGadgetMap[gadget.productCode] = gadget;
            }
          }
          var productCodeGadgetMapKeys = Object.keys(
            productCodeGadgetMap);
          if (productCodeGadgetMapKeys.length > 0) {
            subscriptionStatusFactory.checkProductCodes(
              productCodeGadgetMapKeys).then(function (statusItems) {
              for (var i = 0; i < statusItems.length; i++) {
                var statusItem = statusItems[i];
                var gadget = productCodeGadgetMap[statusItem.pc];
                gadget.subscriptionStatus = statusItem.status;
                gadget.expiry = statusItem.expiry;
                gadget.trialPeriod = statusItem.trialPeriod;
                gadget.statusMessage = _getMessage(gadget);
              }
              deferred.resolve(gadgets);
            }, function (e) {
              factory.apiError = e.message ? e.message : e.toString();
              deferred.reject();
            });
          } else {
            deferred.resolve(gadgets);
          }
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      };

      var _getRemainingDays = function (date) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var today = new Date();
        return Math.round(Math.abs((date.getTime() - today.getTime()) / (
          oneDay)));
      };

      var _getMessage = function (gadget) {
        var statusMessage = gadget.subscriptionStatus;
        if (gadget.subscriptionStatus === 'Not Subscribed') {
          statusMessage = $filter('translate')(
            'editor-app.subscription.status.premium');
          if (gadget.trialPeriod > 0) {
            statusMessage = $filter('translate')(
                'editor-app.subscription.status.premium') + ' - ' + gadget.trialPeriod +
              ' ' + $filter('translate')(
                'editor-app.subscription.status.daysTrial');
          }
        } else if (gadget.subscriptionStatus === 'On Trial') {
          statusMessage = statusMessage + ' - ' + _getRemainingDays(new Date(
            gadget.expiry)) + ' ' + $filter('translate')(
            'editor-app.subscription.status.daysRemaining');
        }
        return statusMessage;
      };

      factory.getGadgetWithStatus = function (gadgetId) {
        var deferred = $q.defer();
        factory.updateSubscriptionStatus([gadgetId]).then(function (gadgets) {
          if (gadgets && gadgets.length > 0) {
            deferred.resolve(gadgets[0]);
          } else {
            deferred.reject();
          }
        }, function () {
          deferred.reject();
        });
        return deferred.promise;
      };

      return factory;
    }
  ]);
