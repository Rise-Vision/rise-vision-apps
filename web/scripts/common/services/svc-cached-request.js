'use strict';

angular.module('risevision.apps.services')
  .service('CachedRequest', ['$q',
    function ($q) {
      return function (request, args) {
        var _cachedResponse;

        var factory = {
          loading: false
        };

        factory.execute = function (forceReload) {
          if (_cachedResponse && !forceReload) {
            return $q.resolve(_cachedResponse);
          }

          var deferred = $q.defer();
          factory.loading = true;
          _cachedResponse = undefined;

          request(args)
            .then(function (response) {
              _cachedResponse = response;
              deferred.resolve(response);
            })
            .catch(function (e) {
              factory.apiError = e.message ? e.message : e.toString();
              deferred.reject(e);
            })
            .finally(function () {
              factory.loading = false;
            });

          return deferred.promise;
        };

        return factory;
      };
    }
  ]);
