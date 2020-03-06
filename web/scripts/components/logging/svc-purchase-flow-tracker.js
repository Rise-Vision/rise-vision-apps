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
          displaysCount: plan.displays,
          category: 'Plans',
          inApp: false
        });
      };

      factory.trackPlaceOrderClicked = function (properties) {
        analyticsFactory.track('Place Order Clicked', properties);
      };

      factory.trackOrderPayNowClicked = function (properties) {
        analyticsFactory.track('Order Pay Now Clicked', properties);
      };

      return factory;
    }
  ]);
