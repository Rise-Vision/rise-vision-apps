'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.controllers')
  .controller('SubscriptionCtrl', ['$scope', '$loading', 'subscriptionFactory',
    'userState', 'paymentSourcesFactory', 'companySettingsFactory',
    'taxExemptionFactory', 'plansService', 'helpWidgetFactory',
    function ($scope, $loading, subscriptionFactory, userState,
      paymentSourcesFactory, companySettingsFactory, taxExemptionFactory,
      plansService, helpWidgetFactory) {
      $scope.subscriptionFactory = subscriptionFactory;
      $scope.paymentSourcesFactory = paymentSourcesFactory;
      $scope.companySettingsFactory = companySettingsFactory;
      $scope.taxExemptionFactory = taxExemptionFactory;
      $scope.helpWidgetFactory = helpWidgetFactory;
      $scope.company = userState.getCopyOfSelectedCompany();

      $scope.$watchGroup(['subscriptionFactory.loading', 'taxExemptionFactory.loading',
        'paymentSourcesFactory.loading'
      ], function (values) {
        if (values[0] || values[1] || values[2]) {
          $loading.start('subscription-loader');
        } else {
          $loading.stop('subscription-loader');
        }
      });

      paymentSourcesFactory.init();
      taxExemptionFactory.init();

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

    }
  ]);
