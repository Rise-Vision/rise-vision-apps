'use strict';

angular.module('risevision.common.components.logging')
  .value('SCHEDULE_EVENTS_TO_BQ', [
    'Schedule Created', 'Transitions Added', 'Transitions Removed'
  ])
  .factory('scheduleTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'SCHEDULE_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      SCHEDULE_EVENTS_TO_BQ) {
      return function (eventName, scheduleId, scheduleName, extraProperties) {
        if (eventName) {
          var properties = extraProperties || {};
          properties.scheduleId = scheduleId;
          properties.scheduleName = scheduleName;
          properties.companyId = userState.getSelectedCompanyId();

          analyticsFactory.track(eventName, properties);

          if (SCHEDULE_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, scheduleId);
          }
        }
      };
    }
  ]);
