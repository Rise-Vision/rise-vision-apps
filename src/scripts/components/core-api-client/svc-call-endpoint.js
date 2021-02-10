/* jshint evil:true */
/* jshint unused:false */

/**
 * Created by rodrigopavezi on 10/16/14.
 */
'use strict';
angular.module('risevision.common.core.endpoint', [
    'risevision.common.gapi'
  ])
  .factory('callEndpoint', ['coreAPILoader', '$q', '$log',
    function (coreAPILoader, $q, $log) {
      return function (method, criteria) {
        $log.debug('Endpoint called', method, criteria);

        var deferred = $q.defer();
        coreAPILoader().then(function (core) {
          // Note: This assumes method contains 'core.'
          var request = eval(method)(criteria);
          request.execute(function (resp) {
            $log.debug('Endpoint resp', resp);
            if (resp.result) {
              deferred.resolve(resp);
            } else {
              deferred.reject(resp);
            }
          });
        });
        return deferred.promise;
      };
    }
  ]);
