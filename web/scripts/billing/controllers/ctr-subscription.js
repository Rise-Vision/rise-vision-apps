'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.controllers')
  .controller('SubscriptionCtrl', ['$scope', '$rootScope', '$loading', 'subscriptionFactory',
  'userState', 'creditCardFactory', 'companySettingsFactory', 'ChargebeeFactory', 'plansService',
    function ($scope, $rootScope, $loading, subscriptionFactory, userState, creditCardFactory,
      companySettingsFactory, ChargebeeFactory, plansService) {
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

      $rootScope.$on('chargebee.subscriptionChanged', subscriptionFactory.reloadSubscription);
      $rootScope.$on('chargebee.subscriptionCancelled', subscriptionFactory.reloadSubscription);

      $scope.isInvoiced = function() {
        return subscriptionFactory.item && !subscriptionFactory.item.card;
      };

      $scope.isDisplayLicensePlan = function (subscription) {
        if (!subscription) {
          return false;
        }

        var plan = plansService.getPlanById(subscription.plan_id);
        var volumePlan = plansService.getVolumePlan();

        return plan && plan.productCode === volumePlan.productCode;
      };

      $scope.isVolumePlan = function (subscription) {
        if (!subscription) {
          return false;
        }

        var plan = plansService.getPlanById(subscription.plan_id);

        return plansService.isVolumePlan(plan);
      };

      $scope.getPlanName = function (subscription) {
        if (!subscription) {
          return '';
        }

        var plan = plansService.getPlanById(subscription.plan_id);

        return plan && (plan.name + ' Plan') || subscription.plan_id;
      };

      $scope.editSubscription = function (subscription) {
        var subscriptionId = subscription.id;

        $scope.chargebeeFactory.openSubscriptionDetails(userState.getSelectedCompanyId(), subscriptionId);
      };

      $scope.editPaymentMethods = function () {
        $scope.chargebeeFactory.openPaymentSources(userState.getSelectedCompanyId());
      };

    }
  ]);
