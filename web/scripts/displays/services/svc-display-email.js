'use strict';

angular.module('risevision.displays.services')
  .service('displayEmail', ['userState', 'display', '$q',
    function (userState, display, $q) {
      var factory = {};

      factory.sendingEmail = false;

      factory.send = function (displayId, emailAddress) {
        if (!displayId) {
          return $q.reject('Invalid Display ID');
        }

        factory.sendingEmail = true;

        return display.sendSetupEmail(displayId, (emailAddress || userState.getUserEmail()))
          .finally(function () {
            factory.sendingEmail = false;
          });
      };

      return factory;

    }
  ]);
