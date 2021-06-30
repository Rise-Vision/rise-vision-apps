'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('UnpaidInvoicesCtrl', ['$scope', '$stateParams',
    'billing', 'invoiceFactory', 'ScrollingListService',
    function ($scope, $stateParams, billing, invoiceFactory, ScrollingListService) {

      $scope.invoiceFactory = invoiceFactory;

      $scope.unpaidInvoices = new ScrollingListService(billing.getUnpaidInvoices, {
        companyId: $stateParams.cid,
        token: $stateParams.token,
        name: 'Unpaid Invoices'
      });

    }
  ]);
