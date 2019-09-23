(function (angular) {
  "use strict";

  try {
    angular.module("risevision.common.config");
  } catch (err) {
    angular.module("risevision.common.config", []);
  }

  angular.module("risevision.common.components.plans.services", [
    "risevision.store.authorization",
    "risevision.common.gapi",
    "risevision.common.currency"
  ]);

  angular.module("risevision.common.components.plans", [
    "risevision.common.config",
    "risevision.common.components.plans.services",
    "risevision.common.components.purchase-flow",
    "risevision.common.components.scrolling-list",
    "risevision.common.components.loading",
    "ui.bootstrap"
  ]);

})(angular);
