'use strict';

angular.module('risevision.common.components.purchase-flow')
  .directive('reviewPurchase', ['$templateCache', 'userState', 'purchaseFactory',
    function ($templateCache, userState, purchaseFactory) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/components/purchase-flow/checkout-review-purchase.html'),
        link: function ($scope) {
          $scope.purchase = purchaseFactory.purchase;
          $scope.selectedCompany = userState.getCopyOfSelectedCompany();

          $scope.getAdditionalDisplaysPrice = function () {
            var plan = $scope.purchase.plan;
            if (plan.isMonthly) {
              return (plan.additionalDisplayLicenses * plan.monthly.priceDisplayMonth);
            } else {
              return (plan.additionalDisplayLicenses * plan.yearly.priceDisplayYear);
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
