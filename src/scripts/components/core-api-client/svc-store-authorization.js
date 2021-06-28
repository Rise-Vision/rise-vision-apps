'use strict';

angular.module('risevision.store.authorization', [
    'risevision.common.gapi'
  ])
  .value('AUTH_PATH_URL', 'v1/widget/auth')
  .factory('storeAuthorization', ['$q', '$log', '$http', 'userState', 'environment', 'AUTH_PATH_URL',
    function ($q, $log, $http, userState, environment, AUTH_PATH_URL) {
      var factory = {};

      factory.check = function (productCode) {
        var deferred = $q.defer();

        $http({
          url: environment.STORE_SERVER_URL + AUTH_PATH_URL,
          method: 'GET',
          params: {
            cid: userState.getSelectedCompanyId(),
            pc: productCode,
            startTrial: false
          }
        }).then(function (response) {
          if (response.data.authorized) {
            deferred.resolve(true);
          } else {
            deferred.reject(false);
          }
        }, function (e) {
          $log.error('Failed to check store authorization.', e);
          deferred.reject(e);
        });

        return deferred.promise;
      };

      return factory;
    }
  ]);
