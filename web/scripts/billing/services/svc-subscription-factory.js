'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.services')
  .service('subscriptionFactory', ['$q', '$log', 'billing', 'creditCardFactory',
  'processErrorCode', 'analyticsFactory',
    function ($q, $log, billing, creditCardFactory, processErrorCode, analyticsFactory) {
      var factory = {};

      var _clearMessages = function () {
        factory.loading = false;

        factory.apiError = '';
      };

      factory.init = function(initCreditCards) {
        _clearMessages();

        if (initCreditCards) {
          creditCardFactory.initPaymentMethods(true);
        }
      };

      factory.getSubscription = function (subscriptionId) {
        factory.init(false);

        factory.subscription = null;
        factory.loading = true;

        return billing.getSubscription(subscriptionId)
          .then(function (resp) {
            factory.item = resp.item;
          })
          .catch(function(e) {
            _showErrorMessage(e);
          })
          .finally(function() {
            factory.loading = false;
          });
      };

      factory.reloadSubscription = function () {
        if (factory.item && factory.item.subscription && factory.item.subscription.id) {
          factory.getSubscription(factory.item.subscription.id);
        }
      };

      var _showErrorMessage = function (e) {
        factory.apiError = processErrorCode(e);

        $log.error(factory.apiError, e);
      };

      return factory;        
    }
  ]);
