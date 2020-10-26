'use strict';

angular.module('risevision.apps.purchase')
  .directive('reviewSubscription', ['$templateCache', 'purchaseFactory',
    function ($templateCache, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get(
          'partials/purchase/checkout-review-subscription.html'),
        link: function ($scope) {
          $scope.plan = purchaseFactory.purchase.plan;

          var _getAdditionalDisplayLicenses = function () {
            var licenses = $scope.plan.additionalDisplayLicenses;

            // Workaround for checking Integer value
            // Using Number.isInteger(licenses) causes unit tests to fail
            // if (Number.isInteger(licenses) && licenses >= 0) {
            // if (_.isInteger(licenses) && licenses >= 0) {
            if (!isNaN(licenses) && (licenses % 1 === 0) && licenses >= 0) {
              return licenses;
            }

            return 0;
          };

          $scope.incrementLicenses = function () {
            $scope.plan.additionalDisplayLicenses = _getAdditionalDisplayLicenses() + 1;
          };

          $scope.decrementLicenses = function () {
            if (_getAdditionalDisplayLicenses() === 0) {
              $scope.plan.additionalDisplayLicenses = 0;
            }
            if ($scope.plan.additionalDisplayLicenses > 0) {
              $scope.plan.additionalDisplayLicenses--;
            }
          };

          $scope.getMonthlyPrice = function () {
            return $scope.plan.monthly.billAmount +
              (_getAdditionalDisplayLicenses() * $scope.plan.monthly.priceDisplayMonth);
          };

          $scope.getYearlyPrice = function () {
            return $scope.plan.yearly.billAmount +
              (_getAdditionalDisplayLicenses() * $scope.plan.yearly.priceDisplayYear);
          };

        }
      };
    }
  ]);
