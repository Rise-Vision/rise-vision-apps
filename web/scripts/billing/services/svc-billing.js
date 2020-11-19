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
        getInvoices: function (search, cursor) {
          var deferred = $q.defer();
          var params = {
            'companyId': userState.getSelectedCompanyId(),
            'cursor': cursor,
            'count': search.count
          };

          $log.debug('Store integerations.invoice.list called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.invoice.list(params);
            })
            .then(function (resp) {
              $log.debug('integerations.invoice.list resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get company\'s invoices.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        getInvoicePdf: function (invoiceId) {
          var deferred = $q.defer();
          var params = {
            'companyId': userState.getSelectedCompanyId(),
            'invoiceId': invoiceId
          };

          $log.debug('Store integerations.invoice.getPdf called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.invoice.getPdf(params);
            })
            .then(function (resp) {
              $log.debug('integerations.invoice.getPdf resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get invoice PDF.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
