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
          $scope.isSubcompanySelected = userState.isSubcompanySelected();

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
              purchaseFactory.getEstimate()
                .then(function () {
                  if (!purchaseFactory.purchase.estimate.estimateError) {
                    $scope.addCoupon = false;
                  }
                });
            }
          };

          $scope.clearCouponCode = function () {
            $scope.purchase.couponCode = null;
            $scope.addCoupon = false;

            if (purchaseFactory.purchase.estimate.estimateError) {
              purchaseFactory.getEstimate();
            }
          };

        }
      };
    }
  ]);
