"use strict";

angular.module("risevision.common.components.logging")
  .factory("bigQueryLogging", ["externalLogging", "userState",
    function (externalLogging, userState) {
      var factory = {};

      factory.logEvent = function (eventName, eventDetails, eventValue,
        username, companyId) {
        return externalLogging.logEvent(eventName, eventDetails, eventValue,
          username || userState.getUsername(), companyId || userState.getSelectedCompanyId()
        );
      };

      return factory;
    }
  ]);
