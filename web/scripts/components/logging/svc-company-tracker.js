'use strict';

angular.module('risevision.common.components.logging')
  .value('COMPANY_EVENTS_TO_BQ', [
    'Company Created'
  ])
  .factory('companyTracker', ['userState', 'segmentAnalytics',
    'bigQueryLogging', 'COMPANY_EVENTS_TO_BQ',
    function (userState, segmentAnalytics, bigQueryLogging,
      COMPANY_EVENTS_TO_BQ) {
      return function (eventName, companyId, companyName, isUserCompany) {
        if (eventName) {
          segmentAnalytics.track(eventName, {
            companyId: companyId,
            companyName: companyName,
            isUserCompany: isUserCompany
          });
          if (COMPANY_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, companyName, null,
              userState.getUsername(), companyId);
          }
        }
      };
    }
  ]);
