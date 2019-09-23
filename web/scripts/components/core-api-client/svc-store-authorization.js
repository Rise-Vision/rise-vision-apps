"use strict";

angular.module("risevision.store.authorization", [
  "risevision.common.gapi"
])
  .factory("storeAuthorization", ["$q", "$log", "$http",
    "STORE_SERVER_URL", "userState",
    function ($q, $log, $http, STORE_SERVER_URL, userState) {
      var factory = {};

      factory.check = function (productCode) {
        var deferred = $q.defer();

        $http({
          url: STORE_SERVER_URL + "/v1/widget/auth",
          method: "GET",
          params: {
            cid: userState.getSelectedCompanyId(),
            pc: productCode,
            startTrial: false
          }
        }).then(function (response) {
          if (response.data.authorized) {
            deferred.resolve(true);
          } else {
            deferred.reject(false);
          }
        }, function (e) {
          $log.error("Failed to check store authorization.", e);
          deferred.reject(e);
        });

        return deferred.promise;
      };

      factory.startTrial = function (productCode) {
        var deferred = $q.defer();
        var companyId = userState.getSelectedCompanyId();
        var startTrialUrl = "/v1/product/" + productCode + "/company/" + companyId + "/trial/start";

        $http.get(STORE_SERVER_URL + startTrialUrl)
          .then(function (response) {
            if (!response.error) {
              deferred.resolve(true);
            } else {
              deferred.reject(response);
            }
          }, function (e) {
            $log.error("Failed to start trial.", e);
            deferred.reject(e);
          });

        return deferred.promise;
      };

      return factory;
    }
  ]);
