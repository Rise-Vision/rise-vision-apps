(function () {
  "use strict";

  try {
    angular.module("risevision.common.config");
  } catch (err) {
    angular.module("risevision.common.config", []);
  }

  angular.module("risevision.common.config")
    .value("STORE_URL", "https://store.risevision.com/")
    .value("STORE_SERVER_URL", "https://store-dot-rvaserver2.appspot.com/");

  angular.module("risevision.common.components.subscription-status.config", [])
    .value("IN_RVA_PATH", "product/productId/?cid=companyId")
    .value("ACCOUNT_PATH", "account?cid=companyId")
    .value("PATH_URL", "v1/company/companyId/product/status?pc=")
    .value("AUTH_PATH_URL", "v1/widget/auth?cid=companyId&pc=")
    .value("PATH_URL_BY_DISPLAY_ID",
      "v1/product/productCode/status?displayIds=");

  angular.module("risevision.common.components.subscription-status.filters", [
    "risevision.common.i18n"
  ]);

  angular.module(
    "risevision.common.components.subscription-status.directives", [
      "risevision.common.components.subscription-status.service"
    ]);

  angular.module("risevision.common.components.subscription-status", [
    "ngSanitize",
    "ui.bootstrap",
    "risevision.common.config",
    "risevision.common.components.subscription-status.config",
    "risevision.common.components.subscription-status.directives",
    "risevision.common.components.subscription-status.filters",
    "risevision.common.components.subscription-status.service"
  ]);
}());
