'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('SubscriptionCtrl', ['$scope', '$loading', 'subscriptionFactory', 'userState',
  'creditCardFactory', 'companySettingsFactory',
    function ($scope, $loading, subscriptionFactory, userState, creditCardFactory,
      companySettingsFactory) {
      $scope.subscriptionFactory = subscriptionFactory;
      $scope.creditCardFactory = creditCardFactory;
      $scope.companySettingsFactory = companySettingsFactory;
      $scope.company = userState.getCopyOfSelectedCompany();

      $scope.$watch('subscriptionFactory.loading', function (newValue) {
        if (newValue) {
          $loading.start('subscription-loader');
        } else {
          $loading.stop('subscription-loader');
        }
      });

      $scope.isInvoiced = function() {
        return subscriptionFactory.item && !subscriptionFactory.item.card;
      };

    }
  ]);
