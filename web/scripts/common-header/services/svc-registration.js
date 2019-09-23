(function (angular) {
  "use strict";

  angular.module("risevision.common.registration", [
    "risevision.common.components.userstate",
    "risevision.core.userprofile", "risevision.common.gapi"
  ])

  .config(["uiStatusDependencies",
    function (uiStatusDependencies) {
      uiStatusDependencies.addDependencies({
        "registeredAsRiseVisionUser": "signedInWithGoogle",
        "registrationComplete": ["notLoggedIn",
          "registeredAsRiseVisionUser"
        ]
      });

      uiStatusDependencies.setMaximumRetryCount("signedInWithGoogle", 1);
    }
  ])

  .factory("signedInWithGoogle", ["$q", "userState",
    function ($q, userState) {
      return function () {
        var deferred = $q.defer();
        // userAuthFactory.authenticate(false).then().finally(function () {
        if (userState.isLoggedIn()) {
          deferred.resolve();
        } else {
          deferred.reject("signedInWithGoogle");
        }
        // });
        return deferred.promise;
      };
    }
  ])

  .factory("notLoggedIn", ["$q", "$log", "signedInWithGoogle",
    function ($q, $log, signedInWithGoogle) {
      return function () {
        var deferred = $q.defer();
        signedInWithGoogle().then(function () {
          deferred.reject("notLoggedIn");
        }, deferred.resolve);
        return deferred.promise;
      };
    }
  ])

  .factory("registeredAsRiseVisionUser", ["$q", "getUserProfile",
    "$cookies", "$log", "userState",
    function ($q, getUserProfile, $cookies, $log, userState) {
      return function () {
        var deferred = $q.defer();

        getUserProfile(userState.getUsername()).then(function (profile) {
          if (angular.isDefined(profile.email) &&
            angular.isDefined(profile.mailSyncEnabled)) {
            deferred.resolve(profile);
          } else if ($cookies.get("surpressRegistration")) {
            deferred.resolve({});
          } else {
            deferred.reject("registeredAsRiseVisionUser");
          }
        }, function (err) {
          if (err && err.code === 403) {
            if ($cookies.get("surpressRegistration")) {
              deferred.resolve({});
            } else {
              $log.debug("registeredAsRiseVisionUser rejected", err);
              deferred.reject("registeredAsRiseVisionUser");
            }
          } else {
            deferred.reject();
          }
        });

        return deferred.promise;
      };
    }
  ]);

})(angular);
