(function (angular) {
  "use strict";

  angular.module("risevision.core.oauth2", ["risevision.common.gapi",
    "risevision.core.cache"
  ]).
  factory("getOAuthUserInfo", ["oauth2APILoader", "$q", "userInfoCache",
    "$log",
    function (oauth2APILoader, $q, userInfoCache, $log) {
      return function () {

        var deferred = $q.defer();
        var resp;
        if ((resp = userInfoCache.get("oauth2UserInfo"))) {
          if (resp.error) {
            deferred.reject(resp.error);
          } else {
            deferred.resolve(resp);
          }
        } else {
          oauth2APILoader().then(function (oauth2) {
            oauth2.userinfo.get().execute(function (resp) {
              $log.debug(
                "getOAuthUserInfo oauth2.userinfo.get() resp", resp);
              if (!resp) {
                userInfoCache.remove("oauth2UserInfo");
                deferred.reject();
              } else if (resp.hasOwnProperty("error")) {
                userInfoCache.remove("oauth2UserInfo");
                deferred.reject(resp.error);
              } else {
                userInfoCache.put("oauth2UserInfo", resp);
                deferred.resolve(resp);
              }
            });
          }, deferred.reject);
        }

        return deferred.promise;
      };
    }
  ]);

})(angular);
