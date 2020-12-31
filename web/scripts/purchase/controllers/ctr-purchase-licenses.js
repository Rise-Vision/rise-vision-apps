'use strict';

angular.module('risevision.apps.purchase')

  .controller('PurchaseLicensesCtrl', ['$scope', '$state', '$loading', 'purchaseLicensesFactory',
    'helpWidgetFactory', '$location', 'redirectTo', 'currentPlanFactory',
    function ($scope, $state, $loading, purchaseLicensesFactory, helpWidgetFactory, $location,
      redirectTo, currentPlanFactory) {
      $scope.helpWidgetFactory = helpWidgetFactory;
      $scope.form = {};
      $scope.factory = purchaseLicensesFactory;
      $scope.currentPlan = currentPlanFactory.currentPlan;

      purchaseLicensesFactory.init();

      $scope.$watch('factory.loading', function (loading) {
        if (loading) {
          $loading.start('purchase-licenses-loader');
        } else {
          $loading.stop('purchase-licenses-loader');
        }
      });

      var _isFormValid = function () {
        var form = $scope.form.purchaseLicensesForm;

        return !form || form.$valid;
      };

      $scope.getCouponDescription = function(coupon) {
        /*jshint camelcase: false */
        if(coupon.entity_id === 'EDUCATION') {
          return 'Schools save 10%!';
        }

        return coupon.description;
      };

      $scope.completePayment = function () {
        if (!_isFormValid()) {
          return;
        }

        return purchaseLicensesFactory.completePayment();
      };

      $scope.close = function () {
        $location.path(redirectTo);
      };

    }

  ]);
