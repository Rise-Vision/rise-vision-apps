'use strict';

angular.module('risevision.common.components.logging')
  .value('USER_EVENTS_TO_BQ', [])
  .factory('userTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'USER_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      USER_EVENTS_TO_BQ) {
      return function (eventName, userId, isSelf) {
        if (eventName) {
          analyticsFactory.track(eventName, {
            userId: userId,
            companyId: userState.getSelectedCompanyId(),
            isSelf: isSelf
          });
          if (USER_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName);
          }
        }
      };
    }
  ]);
