"use strict";
angular.module("risevision.common.cookie", ["risevision.common.config"])
  .service("cookieTester", ["$q", "$document", "$http", "COOKIE_CHECK_URL",
    function ($q, $document, $http, COOKIE_CHECK_URL) {
      var svc = {};

      svc.checkCookies = function () {
        var deferred = $q.defer();
        $q.all([svc.checkLocalCookiePermission(), svc.checkThirdPartyCookiePermission()])
          .then(function () {
            deferred.resolve();
          }, function () {
            deferred.reject();
          });
        return deferred.promise;
      };

      svc.checkLocalCookiePermission = function () {
        $document[0].cookie = "rv-test-local-cookie=yes";
        if ($document[0].cookie.indexOf("rv-test-local-cookie") > -1) {
          return $q.when(true);
        }

        return $q.reject(false);
      };

      svc.checkThirdPartyCookiePermission = function () {
        var deferred = $q.defer();

        $http.get(COOKIE_CHECK_URL + "/createThirdPartyCookie", {
          withCredentials: true
        })
          .then(function () {
            return $http.get(COOKIE_CHECK_URL + "/checkThirdPartyCookie", {
              withCredentials: true
            });
          })
          .then(function (resp) {
            if (resp.data.check === "true") {
              deferred.resolve(true);
            } else {
              deferred.reject(false);
            }
          })
          .then(null, function () {
            // Resolve on API failures
            deferred.resolve(false);
          });

        return deferred.promise;
      };

      return svc;
    }
  ]);
