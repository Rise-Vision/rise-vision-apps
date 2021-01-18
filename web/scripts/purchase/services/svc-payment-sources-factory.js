'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.purchase')
  .service('paymentSourcesFactory', ['$q', '$filter', '$modal', '$log', 'billing',
  'processErrorCode', 'analyticsFactory',
    function ($q, $filter, $modal, $log, billing, processErrorCode, analyticsFactory) {
      var factory = {};

      var _clearMessages = function () {
        factory.loading = false;

        factory.apiError = '';
      };

      var _loadCreditCards = function() {
        factory.loading = true;

        return billing.getCreditCards({
          count: 40
        })
        .then(function(result) {
          factory.existingCreditCards = result.items;
          
          if (result.items[0]) {
            factory.selectedCard = result.items[0];
          }
        })
        .finally(function() {
          factory.loading = false;
        });
      };

      factory.init = function() {
        _clearMessages();

        factory.existingCreditCards = [];
        delete factory.selectedCard;

        return _loadCreditCards();
      };

      var _deletePaymentSource = function (paymentSourceId) {
        factory.loading = true;

        return billing.deletePaymentSource(paymentSourceId)
          .then(function () {
            factory.init();
          })
          .catch(function(e) {
            factory.loading = false;

            _showErrorMessage(e);
          });
      };

      factory.removePaymentMethod = function(card) {
        var description = $filter('cardDescription')(card.payment_source.card);

        var modalInstance = $modal.open({
          templateUrl: 'partials/components/confirm-modal/madero-confirm-modal.html',
          controller: 'confirmModalController',
          windowClass: 'madero-style centered-modal',
          size: 'sm',
          resolve: {
            confirmationTitle: function () {
              return 'Remove Payment Method';
            },
            confirmationMessage: function () {
              return 'Are you sure you want to remove this payment method? The <strong> ' + description + '</strong> will be removed from your company.';
            },
            confirmationButton: function () {
              return 'Yes, Remove';
            },
            cancelButton: function () {
              return 'No';
            }
          }
        });

        modalInstance.result.then(function() {
          _deletePaymentSource(card.payment_source.id);
        });

      };

      var _showErrorMessage = function (e) {
        factory.apiError = processErrorCode(e);

        $log.error(factory.apiError, e);
      };

      return factory;        
    }
  ]);
