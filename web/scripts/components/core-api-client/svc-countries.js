(function (angular) {
  "use strict";

  angular.module("risevision.core.countries", ["risevision.common.gapi"])

  .factory("getCoreCountries", ["coreAPILoader", "$q", "$log", "$filter",
    function (coreAPILoader, $q, $log, $filter) {
      var deferred;
      return function () {
        if (deferred) {
          return deferred.promise;
        } else {
          deferred = $q.defer();
        }

        coreAPILoader().then(function (coreApi) {
          return coreApi.country.list();
        })
          .then(function (resp) {
            var items = resp.result ? resp.result.items : [];
            if (items instanceof Array) {
              items = $filter("orderBy")(items, "name");
            }

            deferred.resolve(items);
          })
          .then(null, function (e) {
            $log.debug("getCoreCountries failed", e);
            deferred.reject(e);

            deferred = null;
          });
        return deferred.promise;
      };
    }
  ])
    .factory("COUNTRIES", ["getCoreCountries",
      function (getCoreCountries) {
        var countries = [];

        getCoreCountries().then(function (result) {
          Array.prototype.push.apply(countries, result);
        });

        return countries;
      }
    ]);

})(angular);
