/*jshint camelcase: false */

"use strict";

/* jshint ignore:start */
var gapiLoadingStatus = null;
var handleClientJSLoad = function () {
  gapiLoadingStatus = "loaded";
  console.debug("ClientJS is loaded.");
  //Ready: create a generic event
  var evt = document.createEvent("Events");
  //Aim: initialize it to be the event we want
  evt.initEvent("gapi.loaded", true, true);
  //FIRE!
  window.dispatchEvent(evt);
};
/* jshint ignore:end */

angular.module("risevision.common.gapi", [
  "risevision.common.components.util"
])
  .value("CLIENT_ID", "614513768474.apps.googleusercontent.com")
  .value("OAUTH2_SCOPES", "profile")

.factory("gapiLoader", ["$q", "$window",
  function ($q, $window) {
    var deferred = $q.defer();

    return function () {
      var gapiLoaded;

      if ($window.gapiLoadingStatus === "loaded") {
        deferred.resolve($window.gapi);
      } else if (!$window.gapiLoadingStatus) {
        $window.gapiLoadingStatus = "loading";

        var src = $window.gapiSrc ||
          "//apis.google.com/js/client.js?onload=handleClientJSLoad";
        var fileref = document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", src);
        if (typeof fileref !== "undefined") {
          document.getElementsByTagName("body")[0].appendChild(fileref);
        }

        gapiLoaded = function () {
          deferred.resolve($window.gapi);
          $window.removeEventListener("gapi.loaded", gapiLoaded, false);
        };
        $window.addEventListener("gapi.loaded", gapiLoaded, false);
      }
      return deferred.promise;
    };
  }
])

.factory("auth2APILoader", ["$q", "$log", "$location", "$window", "gapiLoader",
  "getBaseDomain", "CLIENT_ID", "OAUTH2_SCOPES",
  function ($q, $log, $location, $window, gapiLoader, getBaseDomain,
    CLIENT_ID, OAUTH2_SCOPES) {
    return function () {
      var deferred = $q.defer();
      gapiLoader().then(function (gApi) {
        if (gApi.auth2 && gApi.auth2.getAuthInstance()) {
          //already loaded. return right away
          deferred.resolve(gApi.auth2);
        } else {
          gApi.load("auth2", function () {
            if (gApi.auth2) {
              gApi.auth2.init({
                client_id: CLIENT_ID,
                scope: OAUTH2_SCOPES,
                cookie_policy: $location.protocol() + "://" + getBaseDomain() +
                  ($window.location.port ? ":" + $window.location.port : "")
              }).then(function () {
                $log.debug("auth2 API Loaded");

                deferred.resolve(gApi.auth2);
              }, function () {
                var errMsg = "auth2 GoogleAuth Init Failed";
                $log.error(errMsg);
                deferred.reject(errMsg);
              });
            } else {
              var errMsg = "auth2 API Load Failed";
              $log.error(errMsg);
              deferred.reject(errMsg);
            }
          });
        }
      });
      return deferred.promise;
    };
  }
])

.factory("clientAPILoader", ["$q", "$log", "gapiLoader",
  function ($q, $log, gapiLoader) {
    return function () {
      var deferred = $q.defer();
      gapiLoader().then(function (gApi) {
        if (gApi.client) {
          //already loaded. return right away
          deferred.resolve(gApi);
        } else {
          gApi.load("client", function () {
            if (gApi.client) {
              $log.debug("client API Loaded");

              deferred.resolve(gApi);
            } else {
              var errMsg = "client API Load Failed";
              $log.error(errMsg);
              deferred.reject(errMsg);
            }
          });
        }
      });
      return deferred.promise;
    };
  }
])

//abstract method for creading a loader factory service that loads any
//custom Google Client API library

.factory("gapiClientLoaderGenerator", ["$q", "$log", "$timeout", "$http", "clientAPILoader",
  function ($q, $log, $timeout, $http, clientAPILoader) {
    return function (libName, libVer, baseUrl) {
      var gapiAccessValidated = false;

      return function () {
        var deferred = $q.defer();
        clientAPILoader().then(function (gApi) {
          var apiValidationTimer;

          if (gApi.client[libName]) {
            // already loaded. return right away
            gapiAccessValidated = true;
            deferred.resolve(gApi.client[libName]);
          } else {
            gApi.client.load(libName, libVer,
              function () {
                gapiAccessValidated = true;

                if (apiValidationTimer) {
                  $timeout.cancel(apiValidationTimer);
                }

                if (gApi.client[libName]) {
                  $log.debug(libName + "." + libVer + " Loaded");
                  deferred.resolve(gApi.client[libName]);
                } else {
                  var errMsg = libName + "." + libVer + " Load Failed";
                  $log.error(errMsg);
                  deferred.reject(errMsg);
                }
              },
              baseUrl);

            if (!gapiAccessValidated) {
              apiValidationTimer = $timeout(function () {
                gapiAccessValidated = true;

                if (baseUrl && !gApi.client[libName]) {
                  $http({
                    url: baseUrl,
                    method: "GET",
                  }).catch(function (e) {
                    // Expect 404 for success (allow for other valid HTTP responses)
                    if (e && e.status !== 404 && (e.status < 200 || e.status >= 400)) {
                      var errorString = libName + " (" + baseUrl + ") failed to respond";
                      $log.error(errorString, e);

                      // Throw consistent error object
                      deferred.reject({
                        status: -1,
                        result: {
                          error: {
                            code: -1,
                            message: errorString,
                            error: e
                          }
                        }
                      });
                    }
                  });
                }
              }, 10 * 1000);
            }
          }
        });
        return deferred.promise;
      };
    };
  }
])

.factory("oauth2APILoader", ["gapiClientLoaderGenerator",
  function (gapiClientLoaderGenerator) {
    return gapiClientLoaderGenerator("oauth2", "v2");
  }
])

.factory("coreAPILoader", ["CORE_URL", "gapiClientLoaderGenerator",
  "$location",
  function (CORE_URL, gapiClientLoaderGenerator, $location) {
    var baseUrl = $location.search().core_api_base_url ?
      $location.search().core_api_base_url + "/_ah/api" : CORE_URL;
    return gapiClientLoaderGenerator("core", "v1", baseUrl);
  }
])

.factory("riseAPILoader", ["CORE_URL", "gapiClientLoaderGenerator",
  "$location",
  function (CORE_URL, gapiClientLoaderGenerator, $location) {
    var baseUrl = $location.search().core_api_base_url ?
      $location.search().core_api_base_url + "/_ah/api" : CORE_URL;
    return gapiClientLoaderGenerator("rise", "v0", baseUrl);
  }
])

.factory("storeAPILoader", ["STORE_ENDPOINT_URL", "gapiClientLoaderGenerator",
  "$location",
  function (STORE_ENDPOINT_URL, gapiClientLoaderGenerator, $location) {
    var baseUrl = $location.search().store_api_base_url ?
      $location.search().store_api_base_url + "/_ah/api" : STORE_ENDPOINT_URL;
    return gapiClientLoaderGenerator("store", "v0.01", baseUrl);
  }
])

.factory("storageAPILoader", ["STORAGE_ENDPOINT_URL",
  "gapiClientLoaderGenerator", "$location",
  function (STORAGE_ENDPOINT_URL, gapiClientLoaderGenerator, $location) {
    var baseUrl = $location.search().storage_api_base_url ?
      $location.search().storage_api_base_url + "/_ah/api" : STORAGE_ENDPOINT_URL;
    return gapiClientLoaderGenerator("storage", "v0.02", baseUrl);
  }
])

.factory("discoveryAPILoader", ["CORE_URL", "gapiClientLoaderGenerator",
  "$location",
  function (CORE_URL, gapiClientLoaderGenerator, $location) {
    var baseUrl = $location.search().core_api_base_url ?
      $location.search().core_api_base_url + "/_ah/api" : CORE_URL;
    return gapiClientLoaderGenerator("discovery", "v1", baseUrl);
  }
])

.factory("monitoringAPILoader", ["MONITORING_SERVICE_URL",
  "gapiClientLoaderGenerator", "$location",
  function (MONITORING_SERVICE_URL, gapiClientLoaderGenerator, $location) {
    var baseUrl = $location.search().core_api_base_url ?
      $location.search().core_api_base_url + "/_ah/api" : MONITORING_SERVICE_URL;
    return gapiClientLoaderGenerator("monitoring", "v0", baseUrl);
  }
]);
