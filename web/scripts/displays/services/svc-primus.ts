'use strict';

angular.module('risevision.displays.services')
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
