'use strict';

angular.module('risevision.apps.services')
  .value('SUBSCRIPTION_STATUS_MAP', {
    'On Trial': 'on-trial',
    'Trial Expired': 'trial-expired',
    'Trial Available': 'trial-available',
    'Subscribed': 'subscribed',
    'Suspended': 'suspended',
    'Cancelled': 'cancelled',
    'Free': 'free',
    'Not Subscribed': 'not-subscribed'
  })
  .factory('getProductSubscriptionStatus', ['$http', '$q', 'STORE_SERVER_URL',
    function ($http, $q, STORE_SERVER_URL) {
      return function (productCode, displayIds) {
        var deferred = $q.defer();
        var path = 'v1/product/' + productCode + '/status?displayIds=' + displayIds.join(','); // + '&callback=cb';

        $http.get(STORE_SERVER_URL + path)
          .then(function (resp) {
            var statusMap = resp.data.reduce(function (map, status) {
              map[status.displayId] = status;
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
  ])
  .factory('getCompanySubscriptionStatus', ['$http', '$q', 'STORE_SERVER_URL',
  function ($http, $q, STORE_SERVER_URL) {
    return function (productCode, companyId) {
      var deferred = $q.defer();
      var path = 'v1/company/' + companyId + '/product/status?pc=' + productCode;

      $http.get(STORE_SERVER_URL + path)
        .then(function (resp) {
          deferred.resolve(resp.data[0]);
        })
        .catch(function (err) {
          console.log('Failed to retrieve company subscription status', err);
          deferred.reject(err);
        });

      return deferred.promise;
    };
  }
]);
