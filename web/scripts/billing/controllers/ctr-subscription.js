'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('SubscriptionCtrl', ['$scope', '$loading', 'billingFactory',
    function ($scope, $loading, billingFactory) {
      $scope.billingFactory = billingFactory;

      $scope.$watch('billingFactory.loading', function (newValue) {
        if (newValue) {
          $loading.start('subscription-loader');
        } else {
          $loading.stop('subscription-loader');
        }
      });

    }
  ]);
