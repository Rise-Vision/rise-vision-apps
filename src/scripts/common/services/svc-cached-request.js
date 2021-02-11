'use strict';

angular.module('risevision.apps.services')
  .service('CachedRequest', ['$q',
    function ($q) {
      return function (request, args) {
        var _cachedPromise;

        var factory = {
          loading: false
        };

        var _request = function () {
          factory.loading = true;

          return request(args)
            .catch(function (e) {
              factory.apiError = e.message ? e.message : e.toString();
              return $q.reject(e);
            })
            .finally(function () {
              factory.loading = false;
            });
        };

        factory.reset = function () {
          _cachedPromise = undefined;
        };

        factory.execute = function (forceReload) {
          var deferred;

          // Clear
          if (forceReload) {
            factory.reset();
          }

          // Return cached promise
          if (_cachedPromise) {
            return _cachedPromise.promise;
          } else {
            _cachedPromise = $q.defer();
          }

          // Always resolve local copy of promise
          // in case cached version is cleared
          deferred = _cachedPromise;

          _request()
            .then(function (response) {
              deferred.resolve(response);
            })
            .catch(function (e) {
              deferred.reject(e);
            });

          return deferred.promise;
        };

        return factory;
      };
    }
  ]);
