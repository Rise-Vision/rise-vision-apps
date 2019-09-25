/*globals element, by */
(function(module) {
  'use strict';

  var PlansModalPage = function () {
    var plansList = ["free", "starter", "basic", "advanced", "enterprise"];
    var plansModal = element(by.css("#plans-modal"));

    this.getPlansModal = function() {
      return plansModal;
    };

    function getButtonByPlan(selector, plan) {
      var idx = plansList.indexOf(plan) + 1;

      return element(by.css("#planHeader > div:nth-child(" + idx + ")")).element(by.id(selector));
    }

    this.getCurrentPlanButton = function(plan) {
      return getButtonByPlan("current-plan", plan);
    };

    this.getSubscribePlanButton = function(plan) {
      return getButtonByPlan("subscribe-plan-cb", plan);
    };

    this.getDowngradePlanButton = function(plan) {
      var selector = (plan === "free") ? "downgrade-plan-cbp" : "downgrade-plan-cb";

      return getButtonByPlan(selector, plan);
    };

    this.getStartTrialPlanButton = function(plan) {
      return getButtonByPlan("start-trial-plan", plan);
    };

    this.getTrialDaysRemaining = function(plan) {
      return getButtonByPlan("trial-days-remaining", plan);
    };
  };

  module.exports = PlansModalPage;
})(module);
