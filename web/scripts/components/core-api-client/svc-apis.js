/**
 * Created by rodrigopavezi on 10/16/14.
 */
"use strict";

angular.module("risevision.common.apis", [
  "risevision.common.gapi"
])
  .factory("listApis", ["$q", "discoveryAPILoader", "$log",
    function ($q, discoveryAPILoader, $log) {
      return function (name, preferred) {
        $log.debug("listApis called", name, preferred);

        var deferred = $q.defer();

        discoveryAPILoader().then(function (discoveryAPI) {
          var criteria = {};
          if (name) {
            criteria.name = name;
          }
          if (preferred) {
            criteria.preferred = preferred;
          }

          var request = discoveryAPI.apis.list(criteria);
          request.execute(function (resp) {
            $log.debug("listApis resp", resp);
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
  ])
  .factory("getRest", ["$q", "discoveryAPILoader", "$log",
    function ($q, discoveryAPILoader, $log) {
      return function (api, version) {
        $log.debug("getRest called", api, version);

        var deferred = $q.defer();
        discoveryAPILoader().then(function (discoveryAPI) {
          var criteria = {};
          if (api) {
            criteria.api = api;
          }
          if (version) {
            criteria.version = version;
          }
          var request = discoveryAPI.apis.getRest(criteria);
          request.execute(function (resp) {
            $log.debug("getRest resp", resp);
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
