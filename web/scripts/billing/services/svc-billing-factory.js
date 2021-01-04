'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.services')
  .service('billingFactory', ['$q', '$log', '$window', '$stateParams', 'billing',
    'storeService', 'creditCardFactory', 'userState', 'processErrorCode', 'analyticsFactory',
    function ($q, $log, $window, $stateParams, billing, storeService, creditCardFactory,
      userState, processErrorCode, analyticsFactory) {
      var factory = {};

      var _clearMessages = function () {
        factory.loading = false;

        factory.apiError = '';
      };

      factory.init = function() {
        _clearMessages();

        creditCardFactory.initPaymentMethods(true);
      };

      var _getCompanyId = function() {
        return $stateParams.cid || userState.getSelectedCompanyId();
      };

      factory.getToken = function () {
        if ($stateParams.token) {
          return $stateParams.token;
        }

        var company = userState.getCopyOfSelectedCompany();
        var authKey = company && company.authKey;

        if (authKey) {
          return authKey.substr(authKey.length - 6);
        } else {
          return null;
        }
      };

      factory.getInvoice = function (invoiceId, companyId, token) {
        factory.init();

        factory.invoice = null;
        factory.loading = true;

        return billing.getInvoice(invoiceId, companyId, token)
          .then(function (resp) {
            factory.invoice = resp.item;
          })
          .catch(function(e) {
            _showErrorMessage(e);
          })
          .finally(function() {
            factory.loading = false;
          });
      };

      factory.updateInvoice = function () {
        _clearMessages();

        factory.loading = true;

        return billing.updateInvoice(factory.invoice, _getCompanyId(), factory.getToken())
          .then(function (resp) {
            factory.invoice = resp.item;
          })
          .catch(function(e) {
            _showErrorMessage(e);
          })
          .finally(function() {
            factory.loading = false;
          });
      };

      var _preparePaymentIntent = function () {
        var paymentMethodId = creditCardFactory.getPaymentMethodId();

        return storeService.preparePayment(paymentMethodId, factory.invoice.id, 
          _getCompanyId(), factory.getToken())
          .then(function (response) {
            if (response.error) {
              return $q.reject(response.error);
            } else {
              creditCardFactory.paymentMethods.intentResponse = response;
              if (response.authenticationRequired) {
                return creditCardFactory.authenticate3ds(response.intentSecret);
              } else {
                return $q.resolve();
              }
            }
          });
      };

      var _completePayment = function () {
        var paymentIntentId = creditCardFactory.paymentMethods.intentResponse ?
          creditCardFactory.paymentMethods.intentResponse.intentId : null;

        return storeService.collectPayment(paymentIntentId, factory.invoice.id, 
          _getCompanyId(), factory.getToken())
          .then(function () {
            var originalAmountDue = factory.invoice.amount_due;

            factory.invoice.status = 'paid';
            factory.invoice.amount_paid = factory.invoice.total;
            factory.invoice.amount_due = 0;

            analyticsFactory.track('Invoice Paid', {
              invoiceId: factory.invoice.id,
              currency: factory.invoice.currency_code,
              amount: originalAmountDue / 100,
              userId: userState.getUsername(),
              companyId: factory.invoice.customer_id
            });

          //   factory.purchase.reloadingCompany = true;
          // 
          //   $timeout(10000)
          //     .then(function () {
          //       return userState.reloadSelectedCompany();
          //     })
          //     .then(function () {
          //       $rootScope.$emit('risevision.company.planStarted');
          //     })
          //     .catch(function (err) {
          //       $log.debug('Failed to reload company', err);
          //     })
          //     .finally(function () {
          //       factory.purchase.reloadingCompany = false;
          //     });
          });
      };

      factory.payInvoice = function () {
        _clearMessages();

        factory.loading = true;

        creditCardFactory.validatePaymentMethod()
          .then(_preparePaymentIntent)
          .then(_completePayment)
          .catch(function(e) {
            _showErrorMessage(e);
          })
          .finally(function() {
            factory.loading = false;
          });
      };

      factory.downloadInvoice = function (invoiceId) {
        _clearMessages();

        factory.loading = true;

        billing.getInvoicePdf(invoiceId, _getCompanyId(), factory.getToken())
          .then(function (resp) {
            if (resp && resp.result) {
              // Trigger download
              $window.location.href = resp.result;
            }
          })
          .catch(function(e) {
            _showErrorMessage(e);
          })
          .finally(function() {
            factory.loading = false;
          });
      };

      var _showErrorMessage = function (e) {
        factory.apiError = processErrorCode(e);

        $log.error(factory.apiError, e);
      };

      return factory;        
    }
  ]);
