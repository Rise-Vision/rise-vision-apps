'use strict';

angular.module('risevision.apps.purchase')
  .directive('planPicker', ['$templateCache', 'currentPlanFactory', 'userState', 'purchaseFactory',
    'PLANS_LIST', 'CHARGEBEE_PLANS_USE_PROD',
    function ($templateCache, currentPlanFactory, userState, purchaseFactory,
      PLANS_LIST, CHARGEBEE_PLANS_USE_PROD) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-plan-picker.html'),
        link: function ($scope) {
          var volumePlan = _.find(PLANS_LIST, {
            type: 'volume'
          });

          $scope.pricingAtLeastOneDisplay = true;
          $scope.currentPlan = currentPlanFactory.currentPlan;
          $scope.isMonthly = true;
          $scope.pricingComponentDiscount = false;
          $scope.useProductionChargebeeData = CHARGEBEE_PLANS_USE_PROD === 'true';

          function _setPricingComponentDiscount() {
            var companyIndustry = userState.getCopyOfSelectedCompany().companyIndustry;

            $scope.pricingComponentDiscount = volumePlan
              .discountIndustries.indexOf(companyIndustry) >= 0;
          }

          $scope.isFree = function (plan) {
            return plan.type === 'free';
          };

          $scope.isStarter = function (plan) {
            return plan.type === 'starter';
          };

          $scope.showSavings = function (plan) {
            return !$scope.isFree(plan) && (!$scope.isStarter(plan) || !$scope.isMonthly);
          };

          $scope.isChargebee = function () {
            return userState.isSelectedCompanyChargebee();
          };

          $scope.refreshButton = function () {
            var component = document.querySelector('pricing-component');

            $scope.pricingAtLeastOneDisplay = component &&
              component.displayCount &&
              component.displayCount > 0;
          };

          $scope.purchasePlan = function () {
            var component = document.querySelector('pricing-component');

            var displays = component.displayCount;
            var period = component.period === 'yearly' ? 'Yearly' : 'Monthly';
            var tierName = component.tierName;
            var s = displays > 1 ? 's' : '';
            var plan = '' + displays + ' Display' + s + ' (' + tierName + ' Plan, ' + period + ')';

            if (displays === 0 || displays === '0') {
              return;
            }

            purchaseFactory.purchasePlan({
              name: plan,
              productId: volumePlan.productId,
              productCode: volumePlan.productCode,
              displays: displays,
              yearly: {
                billAmount: component.priceTotal
              },
              monthly: {
                billAmount: component.priceTotal
              }
            }, component.period === 'monthly');

            $scope.setNextStep();
          };

          $scope.init = function () {
            _setPricingComponentDiscount();
          };

          $scope.init();
        }
      };
    }
  ]);
