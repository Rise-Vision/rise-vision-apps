'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('SubscriptionCtrl', ['$scope', '$loading', 'subscriptionFactory', 'userState',
  'companySettingsFactory',
    function ($scope, $loading, subscriptionFactory, userState, companySettingsFactory) {
      $scope.subscriptionFactory = subscriptionFactory;
      $scope.companySettingsFactory = companySettingsFactory;
      $scope.company = userState.getCopyOfSelectedCompany();

      $scope.$watch('subscriptionFactory.loading', function (newValue) {
        if (newValue) {
          $loading.start('subscription-loader');
        } else {
          $loading.stop('subscription-loader');
        }
      });

    }
  ]);
