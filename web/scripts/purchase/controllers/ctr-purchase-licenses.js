'use strict';

angular.module('risevision.apps.purchase')

  .controller('PurchaseLicensesCtrl', ['$scope', '$state', '$loading', 'purchaseLicensesFactory',
    'helpWidgetFactory', '$location', 'redirectTo', 'currentPlanFactory',
    function ($scope, $state, $loading, purchaseLicensesFactory, helpWidgetFactory, $location,
      redirectTo, currentPlanFactory) {
      $scope.helpWidgetFactory = helpWidgetFactory;
      $scope.factory = purchaseLicensesFactory;
      $scope.currentPlan = currentPlanFactory.currentPlan;
      $scope.couponCode = '';

      purchaseLicensesFactory.init();

      $scope.$watch('factory.loading', function (loading) {
        if (loading) {
          $loading.start('purchase-licenses-loader');
        } else {
          $loading.stop('purchase-licenses-loader');
        }
      });

      var _isFormValid = function () {
        var form = $scope.purchaseLicensesForm;
        return !form || form.$valid;
      };

      $scope.applyCouponCode = function () {
        if (!_isFormValid()) {
          return;
        }

        if ($scope.couponCode) {
          $scope.factory.purchase.couponCode = $scope.couponCode;

          $scope.factory.getEstimate()
            .then(function () {
              if (!$scope.factory.apiError) {
                $scope.addCoupon = false;
              }
            });
        }
      };

      $scope.clearCouponCode = function () {
        $scope.couponCode = null;
        $scope.factory.purchase.couponCode = null;
        $scope.addCoupon = false;

        if ($scope.factory.apiError) {
          $scope.factory.getEstimate();
        }
      };

      $scope.getEstimate = function() {
        if (!_isFormValid()) {
          return;
        }

        return purchaseLicensesFactory.getEstimate();
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
