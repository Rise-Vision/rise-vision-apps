'use strict';

angular.module('risevision.common.components.logging')
  .value('USER_EVENTS_TO_BQ', [])
  .factory('userTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'USER_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      USER_EVENTS_TO_BQ) {
      return function (eventName, userId, isSelf, invitedEmail) {
        if (eventName) {
          var properties = {
            userId: userId,
            companyId: userState.getSelectedCompanyId(),
            isSelf: isSelf
          };
          if (invitedEmail) {
            properties.invitedEmail = invitedEmail;
          }
          analyticsFactory.track(eventName, properties);
          if (USER_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName);
          }
        }
      };
    }
  ]);
