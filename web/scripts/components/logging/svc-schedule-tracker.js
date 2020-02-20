'use strict';

angular.module('risevision.common.components.logging')
  .value('SCHEDULE_EVENTS_TO_BQ', [
    'Schedule Created'
  ])
  .factory('scheduleTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'SCHEDULE_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      SCHEDULE_EVENTS_TO_BQ) {
      return function (eventName, scheduleId, scheduleName) {
        if (eventName) {
          analyticsFactory.track(eventName, {
            scheduleId: scheduleId,
            scheduleName: scheduleName,
            companyId: userState.getSelectedCompanyId()
          });
          if (SCHEDULE_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, scheduleId);
          }
        }
      };
    }
  ]);
