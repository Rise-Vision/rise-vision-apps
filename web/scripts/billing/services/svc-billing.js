'use strict';

angular.module('risevision.apps.billing.services')
  .constant('INVOICE_WRITABLE_FIELDS', [
    'poNumber'
  ])
  .service('billing', ['$q', '$log', 'pick', 'storeAPILoader', 'userState',
    'INVOICE_WRITABLE_FIELDS',
    function ($q, $log, pick, storeAPILoader, userState, INVOICE_WRITABLE_FIELDS) {
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

          $log.debug('Store integrations.invoice.list called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.invoice.list(params);
            })
            .then(function (resp) {
              $log.debug('integrations.invoice.list resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get company\'s invoices.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        getUnpaidInvoices: function (search, cursor) {
          var deferred = $q.defer();
          var params = {
            'companyId': search.companyId,
            'token': search.token,
            'cursor': cursor,
            'count': search.count
          };

          $log.debug('Store integrations.invoice.listUnpaid called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.invoice.listUnpaid(params);
            })
            .then(function (resp) {
              $log.debug('integrations.invoice.listUnpaid resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get company\'s unpaid invoices.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        getInvoice: function (invoiceId, companyId, token) {
          var deferred = $q.defer();
          var params = {
            'companyId': companyId,
            'invoiceId': invoiceId,
            'token': token
          };

          $log.debug('Store integrations.invoice.get called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.invoice.get(params);
            })
            .then(function (resp) {
              $log.debug('integrations.invoice.get resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get invoice.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        updateInvoice: function (invoice, companyId, token) {
          var deferred = $q.defer();

          var fields = pick.apply(this, [invoice].concat(INVOICE_WRITABLE_FIELDS));
          var params = {
            'companyId': companyId,
            'invoiceId': invoice.id,
            'token': token,
            'data': fields
          };

          $log.debug('Store integrations.invoice.put called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.invoice.put(params);
            })
            .then(function (resp) {
              $log.debug('integrations.invoice.put resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to update invoice.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        getInvoicePdf: function (invoiceId, companyId, token) {
          var deferred = $q.defer();
          var params = {
            'companyId': companyId,
            'invoiceId': invoiceId,
            'token': token
          };

          $log.debug('Store integrations.invoice.getPdf called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.invoice.getPdf(params);
            })
            .then(function (resp) {
              $log.debug('integrations.invoice.getPdf resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get invoice PDF.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        getCreditCards: function (search, cursor) {
          var deferred = $q.defer();
          var params = {
            'companyId': userState.getSelectedCompanyId(),
            'cursor': cursor,
            'count': search.count
          };

          $log.debug('Store integrations.card.list called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.card.list(params);
            })
            .then(function (resp) {
              $log.debug('integrations.card.list resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get company\'s cards.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
