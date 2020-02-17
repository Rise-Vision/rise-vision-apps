'use strict';

angular.module('risevision.common.components.logging')
  .value('DISPLAY_EVENTS_TO_BQ', [
    'Display Created',
    'Player Download'
  ])
  .factory('displayTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'DISPLAY_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      DISPLAY_EVENTS_TO_BQ) {
      return function (eventName, displayId, displayName, downloadType) {
        if (eventName) {
          analyticsFactory.track(eventName, {
            displayId: displayId,
            displayName: displayName,
            companyId: userState.getSelectedCompanyId(),
            downloadType: downloadType
          });
          if (DISPLAY_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, displayId);
          }
        }
      };
    }
  ]);
