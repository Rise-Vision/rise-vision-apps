'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('InvoiceCtrl', ['$scope', '$loading', 'billingFactory',
    function ($scope, $loading, billingFactory) {
      $scope.billingFactory = billingFactory;

      $scope.$watch('billingFactory.loading', function (newValue) {
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

        billingFactory.payInvoice();
      };

      $scope.updatePoNumber = function () {
        billingFactory.invoice.poNumber = billingFactory.invoice.poNumber || '';

        billingFactory.updateInvoice()
          .then(function() {
            $scope.hideEditForm();
          });
      };

      $scope.hideEditForm = function () {
        $scope.editPoNumber = false;
      };

    }
  ]);
