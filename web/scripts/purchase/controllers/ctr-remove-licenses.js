'use strict';

angular.module('risevision.apps.purchase')

  .controller('RemoveLicensesCtrl', ['$scope', '$loading', 'purchaseLicensesFactory',
    '$location', 'redirectTo', 'currentPlanFactory',
    function ($scope, $loading, purchaseLicensesFactory, $location,
      redirectTo, currentPlanFactory) {
      $scope.factory = purchaseLicensesFactory;
      $scope.currentPlan = currentPlanFactory.currentPlan;
      $scope.couponCode = null;

      purchaseLicensesFactory.init();

      $scope.$watch('factory.loading', function (loading) {
        if (loading) {
          $loading.start('remove-licenses-loader');
        } else {
          $loading.stop('remove-licenses-loader');
        }
      });

      var _isFormValid = function () {
        var form = $scope.removeLicensesForm;
        return !form || form.$valid;
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
