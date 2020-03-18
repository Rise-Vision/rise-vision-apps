'use strict';

angular.module('risevision.common.components.logging')
  .value('PRESENTATION_EVENTS_TO_BQ', [
    'Presentation Created',
    'New Presentation',
    'Template Copied',
    'HTML Template Copied'
  ])
  .factory('presentationTracker', ['userState', 'analyticsFactory',
    'bigQueryLogging', 'PRESENTATION_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging,
      PRESENTATION_EVENTS_TO_BQ) {
      return function (eventName, presentationId, presentationName, extraProperties) {
        if (eventName) {
          var properties = extraProperties || {};
          properties.presentationId = presentationId;
          properties.presentationName = presentationName;
          properties.companyId = userState.getSelectedCompanyId();

          analyticsFactory.track(eventName, properties);
          if (PRESENTATION_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, presentationId);
          }
        }
      };
    }
  ]);
