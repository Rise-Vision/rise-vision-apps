'use strict';

angular.module('risevision.common.components.logging')
  .factory('openidTracker', ['userState', 'analyticsFactory', 'bigQueryLogging',
    function (userState, analyticsFactory, bigQueryLogging) {
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

          if (openidEventType === 'silent renew error') {
            bigQueryLogging.logEvent('OpenId silent renew error', null, null, email);
          }
        }
      };
    }
  ]);
