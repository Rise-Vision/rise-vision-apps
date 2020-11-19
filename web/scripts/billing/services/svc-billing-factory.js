'use strict';

angular.module('risevision.apps.billing.services')
  .service('billingFactory', ['$window', 'billing',
    function ($window, billing) {
      var factory = {};

      factory.downloadInvoice = function (invoiceId) {
        billing.getInvoicePdf(invoiceId)
          .then(function (resp) {
            if (resp && resp.result) {
              $window.location.href = resp.result;            
            }
          });
      };

      return factory;
    }
  ]);
