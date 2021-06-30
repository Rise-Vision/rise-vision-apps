'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('InvoiceCtrl', ['$scope', 'invoiceFactory',
    function ($scope, invoiceFactory) {
      $scope.invoiceFactory = invoiceFactory;

      $scope.completeCardPayment = function () {
        if (!$scope.form.paymentMethodsForm.$valid) {
          return;
        }

        invoiceFactory.payInvoice();
      };

    }
  ]);
