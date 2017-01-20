'use strict';

angular.module('risevision.editor.services')
  .factory('storeAuthorization', ['$q', '$log', '$http',
    'STORE_SERVER_URL', 'userState',
    function ($q, $log, $http, STORE_SERVER_URL, userState) {
      var factory = {};

      factory.check = function (productCode) {
        var deferred = $q.defer();

        $http({
          url: STORE_SERVER_URL + '/v1/widget/auth',
          method: 'GET',
          params: {
            cid: userState.getSelectedCompanyId(),
            pc: productCode
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
