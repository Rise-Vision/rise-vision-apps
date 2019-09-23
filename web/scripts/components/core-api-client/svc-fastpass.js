"use strict";

angular.module("risevision.common.fastpass", [])
  .factory("loadFastpass", ["$q", "$http", "$document", "$timeout", "GSFP_URL",
    "$log",
    function ($q, $http, $document, $timeout, GSFP_URL, $log) {

      var loadScript = function (src) {
        var deferred = $q.defer();
        var script = $document[0].createElement("script");
        script.onload = script.onreadystatechange = function (e) {
          deferred.resolve(e);
        };
        script.onerror = function (e) {
          deferred.reject(e);
        };
        script.src = src;
        if ($document && $document[0]) {
          $document[0].body.appendChild(script);
        }
        return deferred.promise;
      };

      return function (username, email) {
        var deferred = $q.defer();
        $log.debug("loadFastpass called", username, email);
        var rejected = function (rej) {
          $log.error("loadFastpass rejected", rej);
          deferred.reject("loadFastpass rejected " + rej);
        };

        $http.get(GSFP_URL +
          "/geturl?userEmail=" + email +
          "&userName=" + username).then(function (res) {
          loadScript(res.data).then(function (result) {
            $log.debug("loadFastpass result", result);
            deferred.resolve(true);
          }, rejected).catch(rejected);
        }, deferred.reject);

        return deferred.promise;
      };

    }
  ]);
