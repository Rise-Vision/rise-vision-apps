'use strict';

angular.module('risevision.apps.billing.controllers')
  .component('invoice', {
    templateUrl: 'partials/billing/invoice.html',
    bindings: {
      inv: '<'
    },
    controller: ['$loading', 'billingFactory',
      function ($loading, billingFactory) {
      this.billingFactory = billingFactory;

      this.$doCheck = function () {
        if (billingFactory.loading) {
          $loading.start('invoice-loader');
        } else {
          $loading.stop('invoice-loader');
        }
      };

      this.completeCardPayment = function () {
        if (!this.form.paymentMethodsForm.$valid) {
          return;
        }

        billingFactory.payInvoice();
      };

    }]
  });
