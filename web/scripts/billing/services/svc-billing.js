'use strict';

angular.module('risevision.apps.billing.services')
  .value('SUBSCRIPTION_SEARCH_FIELDS', [
    'subscriptionId', 'productName', 'unit', 'currencyCode', 'shipToName', 'price', 'status'
  ])
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
            'sort': 'status asc'
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
        }
      };

      return service;
    }
  ]);
