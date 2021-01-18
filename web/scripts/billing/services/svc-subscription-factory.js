'use strict';

angular.module('risevision.apps.billing.services')
  .service('subscriptionFactory', ['$q', '$log', 'billing', 'processErrorCode',
  'analyticsFactory',
    function ($q, $log, billing, processErrorCode, analyticsFactory) {
      var factory = {};

      var _clearMessages = function () {
        factory.loading = false;

        factory.apiError = '';
      };

      factory.getSubscription = function (subscriptionId) {
        _clearMessages();

        factory.item = null;
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
