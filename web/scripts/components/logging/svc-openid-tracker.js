'use strict';

angular.module('risevision.common.components.logging')
  .factory('openidTracker', ['userState', 'analyticsFactory',
    function (userState, analyticsFactory) {
      return function (openidEventType, profile, eventProperties) {
        if (openidEventType) {
          profile = profile || {};
          eventProperties = eventProperties || {};

          angular.extend(eventProperties, {
            openidEventType: openidEventType,
            userId: userState.getUsername(),
            email: userState.getUserEmail() || profile.email,
            googleUserId: profile.sub,
            companyId: userState.getSelectedCompanyId()
          });
          console.log(JSON.stringify(eventProperties));
          analyticsFactory.track('OpenId Event', eventProperties);
        }
      };
    }
  ]);
