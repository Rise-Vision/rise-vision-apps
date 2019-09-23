(function (angular) {
  "use strict";

  angular.module("risevision.common.components.userstate")
    .factory("customAuthFactory", ["$q", "$log", "gapiLoader",
      "userauth", "userState",
      function ($q, $log, gapiLoader, userauth, userState) {
        var factory = {};

        factory.authenticate = function (credentials) {
          var deferred = $q.defer();
          var _state = userState._state;

          if (credentials && credentials.username && credentials.password) {
            $q.all([gapiLoader(), userauth.login(credentials.username,
              credentials.password)])
              .then(function (result) {
                var gApi = result[0];
                var loginInfo = result[1] && result[1].result;

                $log.debug("JWT login result:", loginInfo);
                if (loginInfo && loginInfo.item) {
                  var token = {
                    access_token: loginInfo.item,
                    expires_in: "3600",
                    token_type: "Bearer"
                  };
                  gApi.auth.setToken(token);

                  deferred.resolve({
                    email: credentials.username,
                    token: token
                  });
                } else {
                  deferred.reject("Invalid Auth Token (JWT)");
                }
              })
              .then(null, function (err) {
                deferred.reject(err);
              });
          } else if (_state.userToken && _state.userToken.token) {
            gapiLoader().then(function (gApi) {
              gApi.auth.setToken(_state.userToken.token);

              // TODO: Validate token?

              deferred.resolve(_state.userToken);
            });
          } else {
            deferred.reject();
          }

          return deferred.promise;
        };

        factory.addUser = function (credentials) {
          var deferred = $q.defer();

          if (credentials && credentials.username && credentials.password) {
            userauth.add(credentials.username, credentials.password)
              .then(function (result) {
                deferred.resolve(result);
              })
              .then(null, function () {
                deferred.reject();
              });
          } else {
            deferred.reject();
          }

          return deferred.promise;
        };

        return factory;
      }
    ]);

})(angular);
