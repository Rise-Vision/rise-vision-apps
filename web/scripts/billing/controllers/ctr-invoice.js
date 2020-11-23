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

    }
  ]);
