'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('SubscriptionCtrl', ['$scope', '$loading', 'subscriptionFactory',
    function ($scope, $loading, subscriptionFactory) {
      $scope.subscriptionFactory = subscriptionFactory;

      $scope.$watch('subscriptionFactory.loading', function (newValue) {
        if (newValue) {
          $loading.start('subscription-loader');
        } else {
          $loading.stop('subscription-loader');
        }
      });

    }
  ]);
