'use strict';

angular.module('risevision.editor.services')
  .value('PRESENTATION_EVENTS_TO_BQ', [
    'Presentation Created'
  ])
  .factory('presentationTracker', ['userState', 'segmentAnalytics',
    'bigQueryLogging', 'PRESENTATION_EVENTS_TO_BQ',
    function (userState, segmentAnalytics, bigQueryLogging,
      PRESENTATION_EVENTS_TO_BQ) {
      return function (eventName, presentationId, presentationName) {
        if (eventName) {
          segmentAnalytics.track(eventName, {
            presentationId: presentationId,
            presentationName: presentationName,
            companyId: userState.getSelectedCompanyId()
          });
          if (PRESENTATION_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, presentationId);
          }
        }
      };
    }
  ]);
