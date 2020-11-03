'use strict';

angular.module('risevision.apps.purchase')
  .directive('purchaseSummary', ['$templateCache', 'userState', 'purchaseFactory',
    function ($templateCache, userState, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-purchase-summary.html'),
        link: function ($scope) {
          $scope.purchase = purchaseFactory.purchase;
          $scope.selectedCompany = userState.getCopyOfSelectedCompany();

          purchaseFactory.getEstimate();

          $scope.getAdditionalDisplaysPrice = function () {
            var plan = $scope.purchase.plan;
            if (plan.isMonthly) {
              return (plan.additionalDisplayLicenses * plan.monthly.priceDisplayMonth);
            } else {
              return (plan.additionalDisplayLicenses * plan.yearly.priceDisplayYear);
            }
          };

          $scope.applyCouponCode = function () {
            if ($scope.purchase.couponCode) {
              purchaseFactory.getEstimate();
            }
          };

          $scope.showTaxExemptionModal = function () {
            purchaseFactory.showTaxExemptionModal()
              .then(function () {
                if (purchaseFactory.purchase.taxExemptionSent) {
                  purchaseFactory.getEstimate();
                }

              });
          };

        }
      };
    }
  ]);
