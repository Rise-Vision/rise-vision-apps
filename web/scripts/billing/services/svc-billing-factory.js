'use strict';

angular.module('risevision.apps.billing.services')
  .service('billingFactory', ['$window', 'billing',
    function ($window, billing) {
      var factory = {};

      factory.getInvoicePdf = function (invoiceId) {
        //open window right away to avoid 'Popup blocked' situation
        var w = $window.open();
        //Note: FireFox does not accept relative URL
        w.location.assign($window.location.protocol + '//' + $window.location.host + '/loading-preview.html');
        
        billing.getInvoicePdf(invoiceId).then(function (resp) {
          w.location.assign(resp.result);
        },
        function () {
            //close window in case of error
            w.close();
        });
      };

      return factory;
    }
  ]);
