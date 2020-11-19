'use strict';

angular.module('risevision.apps.billing.services')
  .service('BillingFactory', ['$log', '$window', 'billing', 'processErrorCode',
    function ($log, $window, billing, processErrorCode) {
      return function() {
        var factory = {};

        var _clearMessages = function () {
          factory.loading = false;

          factory.apiError = '';
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
      };
    }
  ]);
