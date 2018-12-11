'use strict';

angular.module('risevision.apps.billing.services')
  .service('billing', ['$q', '$log', 'storeAPILoader', 'userState',
    function ($q, $log, storeAPILoader, userState) {
      var service = {
        getSubscriptions: function (search, cursor) {
          var deferred = $q.defer();
          var params = {
            'companyId': userState.getSelectedCompanyId(),
            'search': 'origin:Chargebee',
            'cursor': cursor,
            'count': search.count,
            'sort': search.sortBy + (search.reverse ? ' desc' : ' asc')
          };

          $log.debug('Store subscription.listUser called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.subscription.listUser(params);
            })
            .then(function (resp) {
              $log.debug('susbcription.listUser resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get company\'s subscriptions.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        getUnpaidInvoices: function() {
          var deferred = $q.defer();
          var params = {
            'companyId': userState.getSelectedCompanyId(),
            'search': 'origin:Rise',
          };

          $log.debug('Store invoice.listUnpaid called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.invoice.listUnpaid(params);
            })
            .then(function (resp) {
              $log.debug('invoice.listUnpaid resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get company\'s unpaid invoices.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
