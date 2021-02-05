'use strict';

angular.module('risevision.common.components.logging')
  .value('USER_EVENTS_TO_BQ', [])
  .factory('userTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'USER_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      USER_EVENTS_TO_BQ) {
      return function (eventName, userId, isSelf, extraProperties) {
        if (eventName) {
          var properties = extraProperties || {};
          properties.userId = userId;
          properties.companyId = userState.getSelectedCompanyId();
          properties.isSelf = isSelf;

          analyticsFactory.track(eventName, properties);
          if (USER_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName);
          }
        }
      };
    }
  ]);
