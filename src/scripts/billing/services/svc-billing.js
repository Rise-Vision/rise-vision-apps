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
            'cursor': cursor,
            'count': search.count
          };

          $log.debug('Store integrations.subscription.list called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.list(params);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.list resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get company\'s subscriptions.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        getSubscription: function (subscriptionId) {
          var deferred = $q.defer();
          var params = {
            'subscriptionId': subscriptionId,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.subscription.get called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.get(params);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.get resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get subscription.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        estimateSubscriptionRenewal: function (subscriptionId) {
          var deferred = $q.defer();

          var obj = {
            subscriptionId: subscriptionId,
            companyId: userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.subscription.estimateRenewal called with', obj);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.estimateRenewal(obj);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.estimateRenewal resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to retrieve subscription renewal estimate.', e);
              deferred.reject(e);
            });
          return deferred.promise;
        },
        estimateSubscriptionUpdate: function (displayCount, subscriptionId, planId, companyId, couponCode) {
          var deferred = $q.defer();

          var obj = {
            displayCount: displayCount,
            subscriptionId: subscriptionId,
            planId: planId,
            companyId: companyId,
            couponCode: couponCode
          };

          $log.debug('Store integrations.subscription.estimate called with', obj);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.estimate(obj);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.estimate resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to retrieve subscription estimate.', e);
              deferred.reject(e);
            });
          return deferred.promise;
        },
        updateSubscription: function (displayCount, subscriptionId, planId, companyId, couponCode) {
          var deferred = $q.defer();

          var obj = {
            displayCount: displayCount,
            subscriptionId: subscriptionId,
            planId: planId,
            companyId: companyId,
            couponCode: couponCode
          };

          $log.debug('Store integrations.subscription.update called with', obj);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.update(obj);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.update resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to retrieve subscription update.', e);
              deferred.reject(e);
            });
          return deferred.promise;
        },
        changePoNumber: function (subscriptionId, poNumber) {
          var deferred = $q.defer();
          var params = {
            'subscriptionId': subscriptionId,
            'poNumber': poNumber,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.subscription.changePoNumber called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.changePoNumber(params);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.changePoNumber resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to change po number for the subscription.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        changePaymentSource: function (subscriptionId, paymentSourceId) {
          var deferred = $q.defer();
          var params = {
            'subscriptionId': subscriptionId,
            'paymentSourceId': paymentSourceId,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.subscription.changePaymentSource called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.changePaymentSource(params);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.changePaymentSource resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to change payment source for the subscription.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        changePaymentToInvoice: function (subscriptionId, poNumber) {
          var deferred = $q.defer();
          var params = {
            'subscriptionId': subscriptionId,
            'poNumber': poNumber,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.subscription.changePaymentToInvoice called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.subscription.changePaymentToInvoice(params);
            })
            .then(function (resp) {
              $log.debug('integrations.subscription.changePaymentToInvoice resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to change payment to invoice for the subscription.', e);
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
        },
        preparePaymentSource: function (paymentMethodId) {
          var deferred = $q.defer();
          var params = {
            'paymentMethodId': paymentMethodId,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.paymentSource.prepare called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.paymentSource.prepare(params);
            })
            .then(function (resp) {
              $log.debug('integrations.paymentSource.prepare resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to prepare payment source.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        addPaymentSource: function (setupIntentId) {
          var deferred = $q.defer();
          var params = {
            'setupIntentId': setupIntentId,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.paymentSource.add called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.paymentSource.add(params);
            })
            .then(function (resp) {
              $log.debug('integrations.paymentSource.add resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to add payment source.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        deletePaymentSource: function (paymentSourceId) {
          var deferred = $q.defer();

          var params = {
            'paymentSourceId': paymentSourceId,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Store integrations.paymentSource.delete called with', params);

          storeAPILoader().then(function (storeApi) {
              return storeApi.integrations.paymentSource.delete(params);
            })
            .then(function (resp) {
              $log.debug('integrations.paymentSource.delete resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to delete payment source.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
