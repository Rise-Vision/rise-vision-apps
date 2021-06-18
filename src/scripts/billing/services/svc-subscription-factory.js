'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.services')
  .service('subscriptionFactory', ['$q', '$log', '$filter', 'confirmModal', 'billing',
    'currentPlanFactory', 'processErrorCode',
    function ($q, $log, $filter, confirmModal, billing, currentPlanFactory,
      processErrorCode) {
      var factory = {};

      var _clearMessages = function () {
        factory.loading = false;

        factory.apiError = '';
      };

      factory.getItemSubscription = function () {
        return factory.item && factory.item.subscription || {};
      };

      factory.getItemCustomer = function () {
        return factory.item && factory.item.customer || {};
      };

      factory.isInvoiced = function () {
        if (factory.getItemSubscription().auto_collection) {
          return factory.getItemSubscription().auto_collection === 'off';
        } else if (factory.getItemCustomer().auto_collection) {
          return factory.getItemCustomer().auto_collection === 'off';
        } else {
          return false;
        }
      };

      factory.getPaymentSourceId = function () {
        if (factory.getItemSubscription().payment_source_id) {
          return factory.getItemSubscription().payment_source_id;
        } else if (factory.getItemCustomer().primary_payment_source_id) {
          return factory.getItemCustomer().primary_payment_source_id;
        } else {
          return null;
        }
      };

      var _updatePaymentSourceId = function () {
        if (factory.isInvoiced()) {
          factory.item.paymentSourceId = 'invoice';
        } else {
          factory.item.paymentSourceId = factory.getPaymentSourceId();
        }
      };

      factory.getSubscription = function (subscriptionId, estimateRenewal) {
        if (!subscriptionId) {
          subscriptionId = currentPlanFactory.currentPlan.subscriptionId;
        }

        _clearMessages();

        factory.item = null;
        factory.loading = true;

        return billing.getSubscription(subscriptionId)
          .then(function (resp) {
            factory.item = resp.item;

            _updatePaymentSourceId();

            if (estimateRenewal) {
              return billing.estimateSubscriptionRenewal(subscriptionId);
            } else {
              return;
            }
          })
          .then(function (resp) {
            factory.renewalEstimate = resp && resp.item;
          })
          .catch(function (e) {
            _showErrorMessage(e);
          })
          .finally(function () {
            factory.loading = false;
          });
      };

      factory.changePoNumber = function () {
        factory.loading = true;

        return billing.changePoNumber(factory.getItemSubscription().id, factory.getItemSubscription().poNumber)
          .then(function (resp) {
            angular.extend(factory.item, resp.item);
          })
          .catch(function (e) {
            _showErrorMessage(e);
          })
          .finally(function () {
            factory.loading = false;
          });
      };

      var _changePaymentSource = function (subscriptionId, paymentSourceId) {
        factory.loading = true;

        return billing.changePaymentSource(subscriptionId, paymentSourceId)
          .then(function (resp) {
            angular.extend(factory.item, resp.item);

            _updatePaymentSourceId();
          })
          .catch(function (e) {
            _showErrorMessage(e);
          })
          .finally(function () {
            factory.loading = false;
          });
      };

      factory.changePaymentMethod = function (event, card) {
        // prevent the radio ng-model from being updated
        event.preventDefault();

        if (!factory.isInvoiced() && factory.getPaymentSourceId() === card.payment_source.id) {
          return;
        }

        var description = $filter('cardDescription')(card.payment_source.card);

        confirmModal('Change Payment Method',
          'Are you sure you want to change the payment method? The <strong>' +
          description +
          '</strong> will be used for this subscription.',
          'Yes, Change', 'Cancel', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
        ).then(function () {
          _changePaymentSource(factory.getItemSubscription().id, card.payment_source.id);
        });
      };

      var _showErrorMessage = function (e) {
        factory.apiError = processErrorCode(e);

        $log.error(factory.apiError, e);
      };

      return factory;
    }
  ]);
