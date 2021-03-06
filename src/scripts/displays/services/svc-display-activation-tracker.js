'use strict';

angular.module('risevision.displays.services')
  .service('displayActivationTracker', ['$log', 'userState', 'analyticsFactory', 'displayTracker',
    'updateUser',
    function ($log, userState, analyticsFactory, displayTracker, updateUser) {
      var _checkActiveDisplay = function (displays) {
        return _.reduce(displays, function (result, display) {
          if (!display.lastActivityDate) {
            return result;
          } else if (!result) {
            return display;
          } else {
            var newTime = new Date(display.lastActivityDate);
            var resultTime = new Date(result.lastActivityDate);
            return newTime > resultTime ? result : display;
          }
        }, null);
      };

      var _updateUserSettings = function (firstDisplayActivationDate) {
        var settings = {};
        settings.firstDisplayActivationDate = firstDisplayActivationDate;

        return updateUser(userState.getUsername(), {
            settings: settings
          })
          .then(function (resp) {
            userState.updateUserProfile(resp.item);
          });
      };

      return function (displays) {
        if (userState.isSubcompanySelected()) {
          return;
        }

        var profile = userState.getCopyOfProfile();

        if (profile && profile.settings && profile.settings.firstDisplayActivationDate) {
          return;
        }

        var activeDisplay = _checkActiveDisplay(displays);

        if (activeDisplay && activeDisplay.lastActivityDate) {
          $log.info('Active display found', activeDisplay);

          var activationDate = activeDisplay.lastActivityDate.toISOString();

          analyticsFactory.identify(userState.getUsername(), {
            firstDisplayActivationDate: activationDate
          });

          displayTracker('first display activated', activeDisplay.id, activeDisplay.name, {
            firstDisplayActivationDate: activationDate
          });

          _updateUserSettings(activationDate);
        }
      };
    }
  ]);
