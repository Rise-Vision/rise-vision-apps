(function (angular) {

  "use strict";
  angular.module("risevision.common.account", [
    "risevision.common.gapi",
    "risevision.core.userprofile",
    "risevision.core.cache"
  ])

  .factory("agreeToTerms", ["$q", "riseAPILoader", "$log", "userInfoCache",
    function ($q, riseAPILoader, $log, userInfoCache) {
      return function () {
        $log.debug("agreeToTerms called.");
        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var request = riseApi.account.agreeToTerms();
          request.execute(function (resp) {
            $log.debug("agreeToTerms resp", resp);
            userInfoCache.removeAll();
            if (!resp.error) {
              deferred.resolve();
            } else {
              deferred.reject(resp.error);
            }
          });
        });
        return deferred.promise;
      };
    }
  ])

  .factory("agreeToTermsAndUpdateUser", ["$q", "$log",
    "agreeToTerms", "updateUser",
    function ($q, $log, agreeToTerms, updateUser) {
      return function (username, basicProfile) {
        $log.debug("registerAccount called.", username, basicProfile);
        var deferred = $q.defer();
        agreeToTerms().then().finally(function () {
          updateUser(username, basicProfile).then(function (resp) {
            if (resp.result) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          }, deferred.reject).finally("registerAccount ended");
        });
        return deferred.promise;
      };
    }
  ])

  .factory("registerAccount", ["$q", "$log",
    "addAccount", "updateUser",
    function ($q, $log, addAccount, updateUser) {
      return function (username, basicProfile) {
        $log.debug("registerAccount called.", username, basicProfile);
        var deferred = $q.defer();
        addAccount().then().finally(function () {
          updateUser(username, basicProfile).then(function (resp) {
            if (resp.result) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          }, deferred.reject).finally("registerAccount ended");
        });
        return deferred.promise;
      };
    }
  ])

  .factory("addAccount", ["$q", "riseAPILoader", "$log",
    function ($q, riseAPILoader, $log) {
      return function () {
        $log.debug("addAccount called.");
        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var request = riseApi.account.add();
          request.execute(function (resp) {
            $log.debug("addAccount resp", resp);
            if (resp.result) {
              deferred.resolve();
            } else {
              deferred.reject("addAccount");
            }
          });
        });
        return deferred.promise;
      };
    }
  ])

  .factory("getAccount", ["$q", "riseAPILoader", "$log",
    function ($q, riseAPILoader, $log) {
      return function () {
        $log.debug("getAccount called.");
        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var request = riseApi.account.get();
          request.execute(function (resp) {
            $log.debug("getAccount resp", resp);
            if (resp.item) {
              deferred.resolve(resp.item);
            } else {
              deferred.reject("getAccount");
            }
          });
        });
        return deferred.promise;
      };
    }
  ]);

})(angular);
