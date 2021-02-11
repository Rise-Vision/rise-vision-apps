'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('InvoiceCtrl', ['$scope', '$loading', 'invoiceFactory',
    function ($scope, $loading, invoiceFactory) {
      $scope.invoiceFactory = invoiceFactory;

      $scope.$watch('invoiceFactory.loading', function (newValue) {
        if (newValue) {
          $loading.start('invoice-loader');
        } else {
          $loading.stop('invoice-loader');
        }
      });

      $scope.completeCardPayment = function () {
        if (!$scope.form.paymentMethodsForm.$valid) {
          return;
        }

        invoiceFactory.payInvoice();
      };

    }
  ]);
