'use strict';

angular.module('risevision.displays.services')
  .factory('loadPrimus', ['$q', '$window', 'environment', function ($q,
    $window, environment) {
    return {
      create: function () {
        var deferred = $q.defer();
        var primus = new $window.Primus(environment.MESSAGING_PRIMUS_URL, {
          reconnect: {
            retries: 0
          }
        });

        deferred.resolve(primus);
        return deferred.promise;
      }
    };
  }]);
