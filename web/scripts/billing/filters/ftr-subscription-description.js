'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.filters')
  .filter('subscriptionDescription', ['plansService',
    function (plansService) {
      var _getPeriod = function (subscription) {
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
        var plan = plansService.getPlanById(subscription.plan_id);
        if (plan) {
          var name = plan.name;

          // Show `1` plan_quantity for Per Display subscriptions
          if (plan && plansService.isVolumePlan(plan) && subscription.plan_quantity > 0) {
            prefix = subscription.plan_quantity + ' x ';
          }

          var period = _getPeriod(subscription);

          if (plansService.isVolumePlan(plan)) {
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
