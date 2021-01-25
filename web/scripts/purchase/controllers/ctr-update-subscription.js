'use strict';

angular.module('risevision.apps.purchase')

  .controller('UpdateSubscriptionCtrl', ['$scope', '$state', '$loading',
    'purchaseLicensesFactory', 'subscriptionFactory', '$location', 'redirectTo',
    function ($scope, $state, $loading, purchaseLicensesFactory,
      subscriptionFactory, $location, redirectTo) {
      $scope.factory = purchaseLicensesFactory;
      $scope.subscriptionFactory = subscriptionFactory;
      $scope.couponCode = null;
      $scope.purchaseAction = $state.current.params.purchaseAction;

      purchaseLicensesFactory.init($scope.purchaseAction);

      $scope.$watchGroup(['factory.loading', 'subscriptionFactory.loading'], function (values) {
        if (values[0] || values[1]) {
          $loading.start('update-subscription-loader');
        } else {
          $loading.stop('update-subscription-loader');
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
        if (redirectTo) {
          $location.path(redirectTo);
        } else {
          $state.go('apps.billing.subscription', {
            subscriptionId: $state.params.subscriptionId
          });
        }
      };

    }

  ]);
