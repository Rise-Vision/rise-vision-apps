'use strict';

angular.module('risevision.template-editor.services')
  .service('slidesUrlValidationService', ['$q', '$http',
    function ($q, $http) {
      var factory = {},
        proxyUrl = 'https://proxy.risevision.com/';

      factory.validate = function (url) {
        if (!url) {
          return $q.resolve('VALID');
        }

        var deferred = $q.defer();

        $http.get(proxyUrl + url)
          .then(function (response) {
            var finalUrl = response.headers('x-final-url');
            if (finalUrl !== url) {
              return deferred.resolve('NOT_PUBLIC');
            }

            return deferred.resolve('VALID');
          }, function () {
            return deferred.resolve('DELETED');
          })
          .catch(function (err) {
            deferred.reject(err);
          });

        return deferred.promise;
      };

      return factory;
    }
  ]);
