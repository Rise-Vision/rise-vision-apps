'use strict';

angular.module('risevision.apps.services')
  .factory('getProductSubscriptionStatus', ['$http', '$q', 'STORE_SERVER_URL',
    function ($http, $q, STORE_SERVER_URL) {
      return function (productCode, displayIds) {
        var deferred = $q.defer();
        var path = 'v1/product/' + productCode + '/status?displayIds=' + displayIds.join(','); // + '&callback=cb';

        $http.get(STORE_SERVER_URL + path)
          .then(function (resp) {
            var statusMap = resp.data.reduce(function (map, status) {
              map[status.displayId] = status;
              map[status.displayId].statusCode = status.status.toLowerCase().replace(' ', '-');
              return map;
            }, {});

            deferred.resolve(statusMap);
          })
          .catch(function (err) {
            console.log(err);
            deferred.reject(err);
          });

        return deferred.promise;
      };
    }
  ]);
