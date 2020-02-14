'use strict';

angular.module('risevision.common.components.logging')
  .factory('launcherTracker', ['userState', 'segmentAnalytics',
    function (userState, segmentAnalytics) {
      return function (eventName) {
        if (eventName) {
          segmentAnalytics.track(eventName, {
            companyId: userState.getSelectedCompanyId()
          });
        }
      };
    }
  ]);
