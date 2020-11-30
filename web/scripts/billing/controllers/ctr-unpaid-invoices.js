'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('UnpaidInvoicesCtrl', ['$scope', '$loading', '$stateParams', 
    'billing', 'billingFactory', 'ScrollingListService',
    function ($scope, $loading, $stateParams, billing, billingFactory, ScrollingListService) {

      $scope.billingFactory = billingFactory;

      $scope.unpaidInvoices = new ScrollingListService(billing.getUnpaidInvoices, {
        companyId: $stateParams.cid,
        token: $stateParams.token,
        name: 'Unpaid Invoices'
      });

      $scope.$watch('unpaidInvoices.loadingItems', function (newValue) {
        if (newValue) {
          $loading.start('unpaid-invoice-loader');
        } else {
          $loading.stop('unpaid-invoice-loader');
        }
      });

    }
  ]);
