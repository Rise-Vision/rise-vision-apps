'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.services')
  .service('subscriptionFactory', ['$q', '$log', '$filter', 'confirmModal', 'billing', 
  'processErrorCode',
    function ($q, $log, $filter, confirmModal, billing, processErrorCode) {
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

      var _changePaymentSource = function (subscriptionId, paymentSourceId) {
        factory.loading = true;

        return billing.changePaymentSource(subscriptionId, paymentSourceId)
          .then(function (resp) {
            angular.extend(factory.item, resp.item);
          })
          .catch(function(e) {
            _showErrorMessage(e);
          })
          .finally(function() {
            factory.loading = false;
          });
      };

      factory.changePaymentMethod = function(event, subscription, card) {
        // prevent the radio ng-model from being updated
        event.preventDefault();

        if (subscription.payment_source_id === card.payment_source.id) {
          return;
        }

        var description = $filter('cardDescription')(card.payment_source.card);
        
        confirmModal('Change Payment Method',
            'Are you sure you want to change the payment method? The <strong>' +
            description +
            '</strong> will be used for this subscription.',
            'Yes, Change', 'Cancel', 'madero-style centered-modal',
            'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
          ).then(function() {
            _changePaymentSource(subscription.id, card.payment_source.id);
          });
      };

      factory.changePaymentToInvoice = function (subscriptionId, poNumber) {
        factory.loading = true;

        return billing.changePaymentToInvoice(subscriptionId, poNumber)
          .then(function (resp) {
            angular.extend(factory.item, resp.item);
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
