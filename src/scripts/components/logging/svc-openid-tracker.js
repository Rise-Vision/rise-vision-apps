'use strict';

angular.module('risevision.common.components.logging')
  .value('OPENID_EVENTS_TO_BQ', ['silent renew error'])
  .factory('openidTracker', ['userState', 'analyticsFactory', 'bigQueryLogging', 'OPENID_EVENTS_TO_BQ',
    function (userState, analyticsFactory, bigQueryLogging, OPENID_EVENTS_TO_BQ) {
      return function (openidEventType, profile, eventProperties) {
        if (openidEventType) {
          profile = profile || {};
          eventProperties = eventProperties || {};

          var userId = userState.getUsername();
          var email = userState.getUserEmail() || profile.email;

          angular.extend(eventProperties, {
            openidEventType: openidEventType,
            userId: userId,
            email: email,
            googleUserId: profile.sub,
            companyId: userState.getSelectedCompanyId()
          });

          analyticsFactory.track('OpenId Event', eventProperties);

          if (OPENID_EVENTS_TO_BQ.indexOf(openidEventType) !== -1) {
            bigQueryLogging.logEvent('OpenId silent renew error', eventProperties.errorMessage, null, userId ||
              email);
          }
        }
      };
    }
  ]);
