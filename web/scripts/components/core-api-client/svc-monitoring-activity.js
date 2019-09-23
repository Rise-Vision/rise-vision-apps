/**
 * Created by rodrigopavezi on 30/01/15.
 */
"use strict";

angular.module("risevision.common.monitoring.activity", [
  "risevision.common.gapi"
])
  .factory("getActivity", ["$q", "monitoringAPILoader", "$log",
    function ($q, monitoringAPILoader, $log) {
      return function (clientId, api) {
        $log.debug("getActivity called", clientId, api);

        var deferred = $q.defer();
        monitoringAPILoader().then(function (monitoringApi) {
          var criteria = {};
          if (clientId) {
            criteria.clientId = clientId;
          }
          if (api) {
            criteria.api = api;
          }

          var request = monitoringApi.activity.get(criteria);
          request.execute(function (resp) {
            $log.debug("getActivity resp", resp);
            if (resp.result) {
              deferred.resolve(resp.result);
            } else {
              deferred.reject(resp);
            }
          });
        }, function (errorResult) {
          $log.debug("Error: " + errorResult);
          deferred.reject(errorResult);
        });
        return deferred.promise;
      };
    }
  ]);
