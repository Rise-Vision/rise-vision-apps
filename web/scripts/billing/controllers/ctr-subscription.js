'use strict';

angular.module('risevision.apps.billing.controllers')
  .controller('SubscriptionCtrl', ['$scope', '$rootScope', '$loading', 'subscriptionFactory',
  'userState', 'creditCardFactory', 'companySettingsFactory', 'ChargebeeFactory',
    function ($scope, $rootScope, $loading, subscriptionFactory, userState, creditCardFactory,
      companySettingsFactory, ChargebeeFactory) {
      $scope.subscriptionFactory = subscriptionFactory;
      $scope.creditCardFactory = creditCardFactory;
      $scope.companySettingsFactory = companySettingsFactory;
      $scope.chargebeeFactory = new ChargebeeFactory();
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

      $rootScope.$on('chargebee.subscriptionChanged', subscriptionFactory.reloadSubscription);
      $rootScope.$on('chargebee.subscriptionCancelled', subscriptionFactory.reloadSubscription);

      $scope.editSubscription = function (subscription) {
        var subscriptionId = subscription.id;

        $scope.chargebeeFactory.openSubscriptionDetails(userState.getSelectedCompanyId(), subscriptionId);
      };

      $scope.editPaymentMethods = function () {
        $scope.chargebeeFactory.openPaymentSources(userState.getSelectedCompanyId());
      };

    }
  ]);
