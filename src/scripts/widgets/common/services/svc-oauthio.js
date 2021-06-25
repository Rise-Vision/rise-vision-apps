'use strict';
angular.module('risevision.widgets.services')
  .value('OAUTH_PUBLIC_KEY', 'EJMI-lB9hB55OYEsYmjXDNfRGoY')
  .factory('OAuthio', ['OAUTH_PUBLIC_KEY', '$window', '$q', '$log',
    function (OAUTH_PUBLIC_KEY, $window, $q, $log) {
      var svc = {};
      if ($window.OAuth) {
        $window.OAuth.initialize(OAUTH_PUBLIC_KEY);
      }

      svc.popup = function (provider, stateToken) {
        var deferred = $q.defer();
        if ($window.OAuth) {
          $window.OAuth.popup(provider, {
            'state': stateToken
          }, function (error, result) {
            if (!error) {
              deferred.resolve(result);
            } else {
              deferred.reject(error);
              $log.debug('could not connect to twitter with oauth.io! ' + error);
            }
          });
        } else {
          deferred.reject(new Error('$window.OAuth is undefined'));
        }

        return deferred.promise;
      };

      return svc;
    }
  ]);
