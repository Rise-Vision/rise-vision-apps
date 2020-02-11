(function (angular) {

  "use strict";

  // This mock disables Google Tag Manager tracking script by
  // resetting the API key
  angular.module("risevision.common.components.logging")
    .value("TAG_MANAGER_CONTAINER_ID", null)
    .value("TAG_MANAGER_AUTH", null)
    .value("TAG_MANAGER_ENV", null);
})(angular);
