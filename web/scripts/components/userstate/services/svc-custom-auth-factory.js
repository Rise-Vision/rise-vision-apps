(function (angular) {
  'use strict';
  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    .factory('customAuthFactory', ['$q', '$log', 'gapiLoader',
      'userauth', 'userState',
      function ($q, $log, gapiLoader, userauth, userState) {
        var factory = {};

        factory.authenticate = function () {
          var _state = userState._state;

          if (_state.userToken && _state.userToken.token) {
            return gapiLoader().then(function (gApi) {
              gApi.auth.setToken(_state.userToken.token);

              // TODO: Validate token?

              return _state.userToken;
            });
          } else {
            return $q.reject();
          }
        };

        var _updateToken = function (username, loginInfo) {
          $log.debug('JWT login result:', loginInfo);

          if (loginInfo && loginInfo.item) {
            return gapiLoader().then(function (gApi) {
              var token = {
                access_token: loginInfo.item,
                expires_in: '3600',
                token_type: 'Bearer'
              };
              var userToken = {
                email: username,
                token: token
              };

              gApi.auth.setToken(token);

              userState._state.userToken = userToken;
            });
          } else {
            return $q.reject('Invalid Auth Token (JWT)');
          }
        };

        factory.loginGoogle = function(token) {
          return _updateToken(null, {item: token});
        };

        factory.login = function (credentials) {
          if (credentials && credentials.username && credentials.password) {
            return userauth.login(credentials.username, credentials.password)
              .then(function (result) {
                var loginInfo = result && result.result;

                return _updateToken(credentials.username, loginInfo);
              });
          } else {
            return $q.reject();
          }
        };

        factory.addUser = function (credentials) {
          if (credentials && credentials.username && credentials.password) {
            return userauth.add(credentials.username, credentials.password)
              .then(function (result) {
                var loginInfo = result && result.result;

                return _updateToken(credentials.username, loginInfo);
              });
          } else {
            return $q.reject();
          }
        };

        return factory;
      }
    ]);

})(angular);
