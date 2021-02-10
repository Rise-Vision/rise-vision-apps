'use strict';

angular.module('risevision.common.components.logging')
  .factory('launcherTracker', ['userState', 'analyticsFactory',
    function (userState, analyticsFactory) {
      return function (eventName) {
        if (eventName) {
          analyticsFactory.track(eventName, {
            companyId: userState.getSelectedCompanyId()
          });
        }
      };
    }
  ]);
