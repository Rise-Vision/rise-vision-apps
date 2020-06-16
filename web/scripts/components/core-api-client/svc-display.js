(function (angular) {
  'use strict';

  angular.module('risevision.core.display', [
      'risevision.common.gapi',
      'risevision.core.util'
    ])

    .service('displayService', ['coreAPILoader', '$q', '$log',
      function (coreAPILoader, $q, $log) {
        this.list = function (companyId, search, cursor, count, sort) {
          var deferred = $q.defer();
          var obj = {
            'companyId': companyId,
            'search': search,
            'cursor': cursor,
            'count': count,
            'sort': sort
          };
          $log.debug('list displays called with', obj);
          coreAPILoader().then(function (coreApi) {
            var request = coreApi.display.list(obj);
            request.execute(function (resp) {
              $log.debug('list displays resp', resp);
              if (resp.result) {
                deferred.resolve(resp.items);
              } else {
                deferred.reject(resp);
              }
            });
          });
          return deferred.promise;
        };
      }
    ]);
})(angular);
