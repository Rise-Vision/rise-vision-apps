'use strict';

angular.module('risevision.common.components.logging')
  .value('DISPLAY_EVENTS_TO_BQ', [
    'Display Created'
  ])
  .factory('displayTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'DISPLAY_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      DISPLAY_EVENTS_TO_BQ) {
      return function (eventName, displayId, displayName, eventProperties) {
        if (eventName) {
          eventProperties = eventProperties || {};
          angular.extend(eventProperties, {
            displayId: displayId,
            displayName: displayName,
            userId: userState.getUsername(),
            email: userState.getUserEmail(),
            companyId: userState.getSelectedCompanyId(),
            companyName: userState.getSelectedCompanyName()
          });

          analyticsFactory.track(eventName, eventProperties);

          if (DISPLAY_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, displayId);
          }
        }
      };
    }
  ]);
