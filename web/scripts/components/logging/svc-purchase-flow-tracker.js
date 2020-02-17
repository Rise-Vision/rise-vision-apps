'use strict';

angular.module('risevision.common.components.logging')
  .factory('purchaseFlowTracker', ['analyticsFactory',
    function (analyticsFactory) {
      var factory = {};

      factory.trackProductAdded = function (plan) {
        analyticsFactory.track('Product Added', {
          id: plan.productCode,
          name: plan.name,
          price: plan.isMonthly ? plan.monthly.billAmount : plan.yearly.billAmount,
          quantity: 1,
          category: 'Plans',
          inApp: false
        });
      };

      factory.trackPlaceOrderClicked = function (estimate) {
        analyticsFactory.track('Place Order Clicked', {
          amount: estimate.total,
          currency: estimate.currency,
          inApp: false
        });
      };

      factory.trackOrderPayNowClicked = function (estimate) {
        analyticsFactory.track('Order Pay Now Clicked', {
          amount: estimate.total,
          currency: estimate.currency,
          inApp: false
        });
      };

      return factory;
    }
  ]);
