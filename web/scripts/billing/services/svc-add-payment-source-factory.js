'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.services')
  .service('addPaymentSourceFactory', ['$q', '$log', 'userState', 'creditCardFactory',
  'billing', 'addressService', 'processErrorCode',
    function ($q, $log, userState, creditCardFactory, billing, addressService,
      processErrorCode) {
      var factory = {};

      var _clearMessages = function () {
        factory.loading = false;

        factory.apiError = '';
      };
      
      factory.init = function() {
        _clearMessages();

        creditCardFactory.initPaymentMethods(false)
          .finally(function() {
            creditCardFactory.paymentMethods.paymentMethod = 'card';
            creditCardFactory.paymentMethods.newCreditCard.billingAddress = addressService.copyAddress(userState.getCopyOfSelectedCompany());
          });
      };

      factory.changePaymentToInvoice = function (subscriptionId, poNumber) {
        _clearMessages();

        factory.loading = true;

        return billing.changePaymentToInvoice(subscriptionId, poNumber)
          .catch(function(e) {
            _showErrorMessage(e);

            return $q.reject(e);
          })
          .finally(function() {
            factory.loading = false;
          });
      };

      var _preparePaymentSource = function () {
        return billing.preparePaymentSource(creditCardFactory.getPaymentMethodId())
          .then(function (response) {
            creditCardFactory.paymentMethods.intentResponse = response;

            if (response.authenticationRequired) {
              return creditCardFactory.authenticate3ds(response.intentSecret);
            } else {
              return $q.resolve();
            }
          });
      };

      var _addPaymentSource = function () {
        var intentId = creditCardFactory.paymentMethods.intentResponse ? 
          creditCardFactory.paymentMethods.intentResponse.intentId : null;

        return billing.addPaymentSource(intentId);
      };

      factory.changePaymentSource = function(subscriptionId) {
        _clearMessages();

        factory.loading = true;

        return creditCardFactory.validatePaymentMethod()
          .then(_preparePaymentSource)
          .then(_addPaymentSource)
          .then(function() {
            // Change Payment Source
          })
          .catch(function (e) {
            _showErrorMessage(e);

            return $q.reject(e);
          })
          .finally(function () {
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
