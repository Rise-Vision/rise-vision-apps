'use strict';

angular.module('risevision.displays.services')
  .factory('loadOldPrimus', ['$q', '$window', 'OLD_MESSAGING_URL', function ($q,
    $window, OLD_MESSAGING_URL) {
    return {
      create: function () {
        var deferred = $q.defer();
        var primus = new $window.PrimusOldMS(OLD_MESSAGING_URL, {
          reconnect: {
            retries: 0
          }
        });

        deferred.resolve(primus);
        return deferred.promise;
      }
    };
  }])

  .factory('loadPrimus', ['$q', '$window', 'MESSAGING_PRIMUS_URL', function ($q,
    $window, MESSAGING_PRIMUS_URL) {
    return {
      create: function () {
        var deferred = $q.defer();
        var primus = new $window.Primus(MESSAGING_PRIMUS_URL, {
          reconnect: {
            retries: 0
          }
        });

        deferred.resolve(primus);
        return deferred.promise;
      }
    };
  }]);
