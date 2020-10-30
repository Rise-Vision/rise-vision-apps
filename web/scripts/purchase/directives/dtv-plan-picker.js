'use strict';

angular.module('risevision.apps.purchase')
  .value('PRICING_DATA', [{
    "id": "34e8b511c4cc4c2affa68205cd1faaab427657dc-cad01y",
    "name": "Digital Displays Annual Plan Cdn",
    "invoice_name": "Digital Displays Annual Plan Cdn",
    "period": 1,
    "period_unit": "year",
    "pricing_model": "volume",
    "free_quantity": 0,
    "status": "active",
    "enabled_in_hosted_pages": true,
    "enabled_in_portal": true,
    "addon_applicability": "all",
    "tax_code": "SW052000",
    "accounting_code": "4112",
    "is_shippable": false,
    "updated_at": 1567181054,
    "giftable": false,
    "resource_version": 1567181054951,
    "object": "plan",
    "charge_model": "volume",
    "taxable": true,
    "currency_code": "CAD",
    "tiers": [{
      "starting_unit": 70,
      "price": 8800,
      "object": "tier"
    }, {
      "starting_unit": 11,
      "ending_unit": 69,
      "price": 9900,
      "object": "tier"
    }, {
      "starting_unit": 3,
      "ending_unit": 10,
      "price": 11000,
      "object": "tier"
    }, {
      "starting_unit": 1,
      "ending_unit": 2,
      "price": 12100,
      "object": "tier"
    }],
    "show_description_in_invoices": false,
    "show_description_in_quotes": false,
    "meta_data": {
      "quantity_meta": {
        "type": "range",
        "min": 1,
        "max": 5000,
        "step": 1
      }
    }
  }, {
    "id": "34e8b511c4cc4c2affa68205cd1faaab427657dc-cad01m",
    "name": "Digital Displays Monthly Plan Cdn",
    "invoice_name": "Digital Displays Monthly Plan Cdn",
    "period": 1,
    "period_unit": "month",
    "pricing_model": "volume",
    "free_quantity": 0,
    "status": "active",
    "enabled_in_hosted_pages": true,
    "enabled_in_portal": true,
    "addon_applicability": "all",
    "tax_code": "SW052000",
    "accounting_code": "4112",
    "is_shippable": false,
    "updated_at": 1567180156,
    "giftable": false,
    "resource_version": 1567180156289,
    "object": "plan",
    "charge_model": "volume",
    "taxable": true,
    "currency_code": "CAD",
    "tiers": [{
      "starting_unit": 1,
      "ending_unit": 2,
      "price": 1100,
      "object": "tier"
    }, {
      "starting_unit": 3,
      "ending_unit": 10,
      "price": 1000,
      "object": "tier"
    }, {
      "starting_unit": 11,
      "ending_unit": 69,
      "price": 900,
      "object": "tier"
    }, {
      "starting_unit": 70,
      "price": 800,
      "object": "tier"
    }],
    "show_description_in_invoices": false,
    "show_description_in_quotes": false,
    "meta_data": {
      "quantity_meta": {
        "type": "range",
        "min": "1",
        "max": "10000",
        "step": "1"
      }
    }
  }, {
    "id": "34e8b511c4cc4c2affa68205cd1faaab427657dc-usd01y",
    "name": "Digital Displays Annual Plan",
    "invoice_name": "Digital Displays Annual Plan",
    "period": 1,
    "period_unit": "year",
    "pricing_model": "volume",
    "free_quantity": 0,
    "status": "active",
    "enabled_in_hosted_pages": true,
    "enabled_in_portal": true,
    "addon_applicability": "all",
    "tax_code": "SW052000",
    "accounting_code": "4112",
    "is_shippable": false,
    "updated_at": 1561683395,
    "giftable": false,
    "resource_version": 1561683395680,
    "object": "plan",
    "charge_model": "volume",
    "taxable": true,
    "currency_code": "USD",
    "tiers": [{
      "starting_unit": 1,
      "ending_unit": 2,
      "price": 12100,
      "object": "tier"
    }, {
      "starting_unit": 3,
      "ending_unit": 10,
      "price": 11000,
      "object": "tier"
    }, {
      "starting_unit": 11,
      "ending_unit": 69,
      "price": 9900,
      "object": "tier"
    }, {
      "starting_unit": 70,
      "price": 8800,
      "object": "tier"
    }],
    "show_description_in_invoices": false,
    "show_description_in_quotes": false
  }, {
    "id": "34e8b511c4cc4c2affa68205cd1faaab427657dc-usd01m",
    "name": "Digital Displays Monthly Plan",
    "invoice_name": "Digital Displays Monthly Plan",
    "period": 1,
    "period_unit": "month",
    "trial_period": 14,
    "trial_period_unit": "day",
    "pricing_model": "volume",
    "free_quantity": 0,
    "status": "active",
    "enabled_in_hosted_pages": true,
    "enabled_in_portal": true,
    "addon_applicability": "all",
    "tax_code": "SW052000",
    "accounting_code": "4112",
    "is_shippable": false,
    "updated_at": 1575992258,
    "giftable": false,
    "resource_version": 1575992258496,
    "object": "plan",
    "charge_model": "volume",
    "taxable": true,
    "currency_code": "USD",
    "tiers": [{
      "starting_unit": 1,
      "ending_unit": 2,
      "price": 1100,
      "object": "tier"
    }, {
      "starting_unit": 3,
      "ending_unit": 10,
      "price": 1000,
      "object": "tier"
    }, {
      "starting_unit": 11,
      "ending_unit": 69,
      "price": 900,
      "object": "tier"
    }, {
      "starting_unit": 70,
      "price": 800,
      "object": "tier"
    }],
    "show_description_in_invoices": false,
    "show_description_in_quotes": false,
    "meta_data": {
      "quantity_meta": {
        "type": "range",
        "min": "1",
        "max": "50",
        "step": "1"
      }
    }
  }])
  .directive('planPicker', ['$templateCache', 'currentPlanFactory', 'userState', 'purchaseFactory',
    'PLANS_LIST', 'CHARGEBEE_PLANS_USE_PROD', 'PRICING_DATA',
    function ($templateCache, currentPlanFactory, userState, purchaseFactory,
      PLANS_LIST, CHARGEBEE_PLANS_USE_PROD, PRICING_DATA) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/purchase/checkout-plan-picker.html'),
        link: {
          pre: function ($scope) {
            //workaround for https://github.com/angular-slider/angularjs-slider/issues/267
            $scope.sliderOptions = {
              hideLimitLabels: true,
              hidePointerLabels: true,
              floor: 1,
              ceil: 100
            };
          },

          post: function ($scope) {
            $scope.displayCount = 5;
            $scope.periodMonthly = false;
            $scope.applyEducationDiscount = userState.isEducationCustomer();

            $scope.$watchGroup(['displayCount', 'periodMonthly'], function () {
              if (!$scope.displayCount) return;

              $scope.basePricePerDisplay = _getTierPrice(true);

              var tierPrice = _getTierPrice($scope.periodMonthly);
              $scope.totalPrice = tierPrice * $scope.displayCount;
              $scope.pricePerDisplay = $scope.periodMonthly ? tierPrice : tierPrice / 12;
              if ($scope.applyEducationDiscount) {
                $scope.pricePerDisplay = $scope.pricePerDisplay * 0.9;
                $scope.totalPrice = $scope.totalPrice * 0.9;
              }
              $scope.yearlySavings = $scope.periodMonthly ? 0 : ($scope.basePricePerDisplay * $scope
                .displayCount * 12) - $scope.totalPrice;
            });

            $scope.purchasePlan = function () {
              var volumePlan = _.find(PLANS_LIST, {
                type: 'volume'
              });
              var displays = $scope.displayCount;
              var period = !$scope.isMonthly ? 'Yearly' : 'Monthly';
              var s = displays > 1 ? 's' : '';
              var plan = '' + displays + ' Display License' + s + ' (' + period + ')';

              if (displays === 0 || displays === '0') {
                return;
              }

              purchaseFactory.purchasePlan({
                name: plan,
                productId: volumePlan.productId,
                productCode: volumePlan.productCode,
                displays: displays,
                yearly: {
                  billAmount: $scope.totalSavings
                },
                monthly: {
                  billAmount: $scope.totalSavings
                }
              }, $scope.periodMonthly);

              $scope.setNextStep();
            };

            // Ported from https://github.com/Rise-Vision/pricing-summary-component/blob/master/pricing-summary-component.mjs#L27
            var _getTierPrice = function (isMonthly) {
              var displayCount = $scope.displayCount;

              if (!PRICING_DATA || PRICING_DATA.failed || Object.keys(PRICING_DATA).length === 0) {
                return 0;
              }
              if (displayCount === 0) {
                return 0;
              }

              var monthlyPlan = PRICING_DATA.filter(function (plan) {
                return plan.period === 1 && plan.period_unit === "month" && plan.currency_code === "USD";
              })[0];

              var yearlyPlan = PRICING_DATA.filter(function (plan) {
                return plan.period === 1 && plan.period_unit === "year" && plan.currency_code === "USD";
              })[0];

              if (!monthlyPlan || !yearlyPlan) {
                return 0;
              }

              var monthlyPrice = monthlyPlan.tiers.filter(function (tier) {
                var upperPrice = tier.ending_unit ? tier.ending_unit : Number.MAX_SAFE_INTEGER;

                return tier.starting_unit <= displayCount && upperPrice >= displayCount;
              })[0].price;

              var yearlyPrice = yearlyPlan.tiers.filter(function (tier) {
                var upperPrice = tier.ending_unit ? tier.ending_unit : Number.MAX_SAFE_INTEGER;

                return tier.starting_unit <= displayCount && upperPrice >= displayCount;
              })[0].price;

              return isMonthly ? monthlyPrice / 100 : yearlyPrice / 100;
            }
          }
        }
      }
    }
  ]);
