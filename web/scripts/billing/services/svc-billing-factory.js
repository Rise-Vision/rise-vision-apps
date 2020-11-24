'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.services')
  .service('billingFactory', ['$q', '$log', '$window', 'billing', 'storeService', 'creditCardFactory',
    'userState', 'processErrorCode',
    function ($q, $log, $window, billing, storeService, creditCardFactory, userState, processErrorCode) {
      var factory = {};

      var _clearMessages = function () {
        factory.loading = false;

        factory.apiError = '';
      };

      factory.init = function() {
        _clearMessages();

        creditCardFactory.initPaymentMethods();
      };

      factory.getInvoice = function (invoiceId) {
        factory.init();

        factory.invoice = null;
        factory.loading = true;

        return billing.getInvoice(invoiceId)
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
        var paymentMethodId = creditCardFactory.paymentMethods.paymentMethodResponse ?
          creditCardFactory.paymentMethods.paymentMethodResponse.paymentMethod.id : null;

        return storeService.preparePayment(paymentMethodId, factory.invoice.id, 
          userState.getSelectedCompanyId())
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
          userState.getSelectedCompanyId())
          .then(function () {
            factory.invoice.status = 'paid';
            factory.invoice.amount_paid = factory.invoice.total;
            factory.invoice.amount_due = 0;

          //   factory.purchase.reloadingCompany = true;
          // 
          //   purchaseFlowTracker.trackOrderPayNowClicked(_getTrackingProperties());
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

        billing.getInvoicePdf(invoiceId)
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
