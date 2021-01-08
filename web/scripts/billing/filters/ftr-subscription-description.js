'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.filters')
  .filter('subscriptionDescription', ['PLANS_LIST', 
    function (PLANS_LIST) {
      var _getPlan = function (subscription) {
        var productCode = subscription.plan_id && subscription.plan_id.split('-')[0];

        var plan = _.find(PLANS_LIST, function (plan) {
          return plan.productCode === productCode;
        });

        return plan;
      };

      var _isVolumePlan = function (plan) {
        return plan && plan.type && plan.type.indexOf('volume') !== -1;
      };

      var _getPeriod = function(subscription) {
        if (subscription.billing_period > 1) {
          return (subscription.billing_period + ' ' + (subscription.billing_period_unit === 'month' ?
            'Month' : 'Year'));
        } else {
          return subscription.billing_period_unit === 'month' ? 'Monthly' : 'Yearly';
        }
      };

      return function (subscription) {
        if (!subscription) {
          return '';
        }

        var prefix = subscription.plan_quantity > 1 ? subscription.plan_quantity + ' x ' : '';
        var plan = _getPlan(subscription);
        if (plan) {
          var name = plan.name;

          // Show `1` plan_quantity for Per Display subscriptions
          if (plan && _isVolumePlan(plan) && subscription.plan_quantity > 0) {
            prefix = subscription.plan_quantity + ' x ';
          }

          var period = _getPeriod(subscription);

          if (_isVolumePlan(plan)) {
            name = name + ' ' + period + ' Plan';
          } else {
            name = name + ' Plan ' + period;
          }

          return prefix + name;
        } else {
          return subscription.plan_id;
        }
      };
    }
  ]);
