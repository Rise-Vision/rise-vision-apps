'use strict';

angular.module('risevision.apps.purchase')

  .controller('RemoveLicensesCtrl', ['$scope', '$loading', 'purchaseLicensesFactory',
    '$location', 'redirectTo', 'currentPlanFactory',
    function ($scope, $loading, purchaseLicensesFactory, $location,
      redirectTo, currentPlanFactory) {
      $scope.factory = purchaseLicensesFactory;
      $scope.currentPlan = currentPlanFactory.currentPlan;
      $scope.couponCode = null;

      var _isFormValid = function () {
        var form = $scope.removeLicensesForm;

        if (!form) {
          return true;
        } else if (form.$invalid) {
          return false;
        }

        var remainingLicenses =
          $scope.currentPlan.playerProTotalLicenseCount - $scope.factory.purchase.displayCount;

        return remainingLicenses > 0;
      };

      $scope.formValid = _isFormValid();

      purchaseLicensesFactory.init();

      $scope.$watch('factory.loading', function (loading) {
        if (loading) {
          $loading.start('remove-licenses-loader');
        } else {
          $loading.stop('remove-licenses-loader');
        }
      });

      $scope.$watch('factory.purchase.displayCount', function () {
        $scope.formValid = _isFormValid();
      });

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
