'use strict';

angular.module('risevision.editor.services')
  .value('EMBEDDED_PRESENTATIONS_CODE', 'd3a418f1a3acaed42cf452fefb1eaed198a1c620')
  .factory('gadgetFactory', ['$q', '$filter', 'gadget', 'BaseList',
    'subscriptionStatusFactory', 'widgetUtils', 'productsFactory',
    'EMBEDDED_PRESENTATIONS_CODE',
    function ($q, $filter, gadget, BaseList, subscriptionStatusFactory, widgetUtils,
      productsFactory, EMBEDDED_PRESENTATIONS_CODE) {
      var factory = {};

      var _gadgets = [{
        gadgetType: 'presentation',
        id: 'presentation',
        name: 'Embedded Presentation',
        productCode: EMBEDDED_PRESENTATIONS_CODE
      }];
      factory.loadingGadget = false;
      factory.apiError = '';

      var _getGadgetByIdCached = function (gadgetId) {
        var cachedGadget = _.find(_gadgets, {
          id: gadgetId
        });

        return cachedGadget;
      };

      var _updateGadgetCache = function (newGadget) {
        if (!_getGadgetByIdCached(gadget.id)) {
          _gadgets.push(newGadget);
        }
      };

      factory.getGadgetById = function (gadgetId) {
        var deferred = $q.defer();
        var cachedGadget = _getGadgetByIdCached(gadgetId);

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

      var _getGadgetByItemCached = function (item) {
        var gadgetId;
        if (item.type === 'presentation') {
          gadgetId = 'presentation';
        } else {
          gadgetId = item.objectReference;
        }

        return _getGadgetByIdCached(gadgetId);
      };

      var _getGadgets = function (items) {
        var deferred = $q.defer();

        var nonCachedIds = [];
        for (var i = 0; i < items.length; i++) {
          var cachedGadget = _getGadgetByItemCached(items[i]);
          if (cachedGadget) {
            items[i].gadget = cachedGadget;
          } else {
            nonCachedIds.push(items[i].objectReference);
          }
        }
        if (nonCachedIds.length === 0) {
          deferred.resolve();
        } else {
          //show loading spinner
          factory.loadingGadget = true;

          gadget.list({
              ids: nonCachedIds
            })
            .then(function (result) {
              if (result.items) {
                for (var i = 0; i < result.items.length; i++) {
                  _updateGadgetCache(result.items[i]);
                }
              }
            })
            .then(null, function (e) {
              factory.apiError = e.message ? e.message : e.toString();
            })
            .finally(function () {
              for (var i = 0; i < items.length; i++) {
                if (!items[i].gadget) {
                  items[i].gadget = _getGadgetByItemCached(items[i]);

                  // resolve potential NPE
                  if (!items[i].gadget) {
                    items[i].gadget = {};
                  }
                }
              }

              factory.loadingGadget = false;

              // Always resolve to return (even impartial) list
              deferred.resolve();
            });
        }

        return deferred.promise;
      };

      factory.updateItemsStatus = function (items) {
        var deferred = $q.defer();

        _getGadgets(items).then(function () {
          var productCodeItemMap = {};
          for (var i = 0; i < items.length; i++) {
            var gadget = items[i].gadget;
            gadget.statusMessage = '';
            if (gadget.productCode) {
              productCodeItemMap[gadget.productCode] = items[i];
            }
          }
          var productCodes = Object.keys(productCodeItemMap);
          if (productCodes.length > 0) {
            subscriptionStatusFactory.checkProductCodes(productCodes)
              .then(function (statusItems) {
                for (var i = 0; i < statusItems.length; i++) {
                  var statusItem = statusItems[i];
                  var gadget = productCodeItemMap[statusItem.pc].gadget;
                  gadget.isSubscribed = statusItem.isSubscribed;
                  gadget.subscriptionStatus = statusItem.status;
                  gadget.expiry = statusItem.expiry;
                  gadget.trialPeriod = statusItem.trialPeriod;
                  gadget.statusMessage = _getMessage(gadget);
                }
                deferred.resolve();
              }, function (e) {
                factory.apiError = e.message ? e.message : e.toString();
                deferred.reject();
              });
          } else {
            deferred.resolve();
          }
        });

        return deferred.promise;
      };

      var _getRemainingDays = function (date) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var today = new Date();
        return Math.round(Math.abs((date.getTime() - today.getTime()) / (
          oneDay)));
      };

      var _showAsProfessional = function (gadget) {
        if (widgetUtils.isProfessionalWidget(gadget.id)) {
          if (productsFactory.isUnlistedProduct(gadget.productCode) && gadget.isSubscribed) {
            return false;
          }
          return true;
        }
        return false;
      };

      var _getMessage = function (gadget) {
        var statusMessage = gadget.subscriptionStatus;
        if (_showAsProfessional(gadget)) {
          statusMessage = $filter('translate')
            ('editor-app.subscription.status.professional');
        } else if (gadget.subscriptionStatus === 'Not Subscribed' && gadget.trialPeriod > 0) {
          statusMessage = statusMessage + ' - ' + gadget.trialPeriod +
            ' ' + $filter('translate')('editor-app.subscription.status.daysTrial');
        } else if (gadget.subscriptionStatus === 'On Trial') {
          statusMessage = statusMessage +
            ' - ' + _getRemainingDays(new Date(gadget.expiry)) +
            ' ' + $filter('translate')('editor-app.subscription.status.daysRemaining');
        }
        return statusMessage;
      };

      return factory;
    }
  ]);
