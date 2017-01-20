'use strict';

angular.module('risevision.displays.services')
  .service('displayEmail', ['$templateCache', 'userState', 'email', '$q',
    function ($templateCache, userState, email, $q) {
      var factory = {};

      factory.sendingEmail = false;

      factory.send = function (displayId, displayName, emailAddress) {
        if (!displayId || !displayName) {
          return $q.reject('Invalid Display ID or Name');
        }

        var template = $templateCache.get(
          'partials/displays/add-display-email.html');
        template = template.replace('{{display.id}}', displayId);
        template = template.replace('{{display.name}}', displayName);

        factory.sendingEmail = true;

        return email.send(emailAddress || userState.getUserEmail(),
            'Set Up Your Display With Rise Vision', template)
          .finally(function () {
            factory.sendingEmail = false;
          });
      };

      return factory;

    }
  ]);
