'use strict';
/*jshint camelcase: false */

angular.module('risevision.apps.purchase')

  .directive('planPicker', ['$templateCache', 'userState', 'purchaseFactory', 'pricingFactory', 'plansService',
    function ($templateCache, userState, purchaseFactory, pricingFactory, plansService) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-plan-picker.html'),
        link: {
          //workaround for https://github.com/angular-slider/angularjs-slider/issues/267
          pre: function ($scope) {
            $scope.sliderOptions = {
              disableAnimation: true,
              hideLimitLabels: true,
              hidePointerLabels: true,
              floor: 1,
              ceil: 100
            };

            $scope.canAccessUnlimitedPlan = userState.isK12Customer();
            $scope.isUnlimitedPlan = false;

            $scope.displayCount = purchaseFactory.purchase.plan.displays;
            $scope.periodMonthly = purchaseFactory.purchase.plan.isMonthly;
            $scope.applyDiscount = userState.isDiscountCustomer();

            $scope.$watchGroup(['displayCount', 'periodMonthly'], function () {
              if (!$scope.displayCount) {
                return;
              }

              $scope.basePricePerDisplay = pricingFactory.getBasePricePerDisplay($scope.displayCount);

              $scope.pricePerDisplay = pricingFactory.getPricePerDisplay($scope.periodMonthly, $scope
                .displayCount, $scope.applyDiscount);
              $scope.totalPrice = pricingFactory.getTotalPrice($scope.periodMonthly, $scope.displayCount, $scope
                .applyDiscount);

              $scope.yearlySavings = ($scope.basePricePerDisplay * $scope.displayCount * 12) - $scope
                .totalPrice;
            });

            $scope.$watch('isUnlimitedPlan', function() {
              if ($scope.isUnlimitedPlan) {
                $scope.totalPrice = plansService.getUnlimitedPlan().yearly.billAmount;
              } else {
                $scope.totalPrice = pricingFactory.getTotalPrice($scope.periodMonthly, $scope.displayCount, $scope
                  .applyDiscount);
              }
            });

            $scope.updatePlan = function () {
              if ($scope.isUnlimitedPlan) {
                purchaseFactory.updateToUnlimitedPlan();
              } else {
                if ($scope.displayCount === 0 || $scope.displayCount === '0') {
                  return;
                }
                purchaseFactory.updatePlan($scope.displayCount, $scope.periodMonthly, $scope.totalPrice, false);
              }              
              $scope.setNextStep();
            };

          }
        }
      };
    }
  ]);
