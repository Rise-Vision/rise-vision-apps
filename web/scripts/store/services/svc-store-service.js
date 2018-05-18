(function () {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.store.services')
    .service('storeService', ['$rootScope', '$q', '$log', 'storeAPILoader',
      'userState',
      function ($rootScope, $q, $log, storeAPILoader, userState) {

        var service = {
          calcTaxes: function (companyId, planId, addonId, addonQty,
            line1, line2, city, postalCode, state, country) {
            var deferred = $q.defer();

            var obj = {
              'companyId': companyId,
              'planId': planId,
              'addonId': addonId,
              'addonQty': addonQty,
              'line1': line1,
              'line2': line2,
              'city': city,
              'country': country,
              'state': state,
              'zip': postalCode
            };

            $log.debug('tax estimate called with', companyId);
            storeAPILoader().then(function (storeApi) {
                return storeApi.tax.estimate(obj);
              })
              .then(function (resp) {
                $log.debug('tax estimate resp', resp);
                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to get tax estimate.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          purchase: function (jsonData) {
            var deferred = $q.defer();
            storeAPILoader().then(function (storeAPI) {
              var obj = {
                'jsonData': jsonData
              };
              var request = storeAPI.purchase.put2(obj);
              request.execute(function (resp) {
                $log.log(resp);
                deferred.resolve(resp);
              });
            });
            return deferred.promise;
          },
          openPortal: function (companyId, returnUrl) {
            var deferred = $q.defer();

            var obj = {
              'companyId': companyId,
              'returnUrl': returnUrl
            };

            storeAPILoader().then(function (storeApi) {
                return storeApi.customer_portal.getUrl(obj);
              })
              .then(function (resp) {
                $log.debug('customer_portal.getUrl resp', resp);
                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to get portal URL.', e);
                deferred.reject(e);
              });
            return deferred.promise;
          }
        };

        return service;
      }
    ]);
})();
