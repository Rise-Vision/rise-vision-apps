(function () {
  'use strict';

  angular.module('risevision.common.components.userstate')
    .service('userauth', ['$q', '$log', '$exceptionHandler', 'riseAPILoader',
      function ($q, $log, $exceptionHandler, riseAPILoader) {

        var service = {
          add: function (username, password) {
            var deferred = $q.defer();

            var obj = {
              data: {
                username: username,
                password: password
              }
            };
            riseAPILoader().then(function (coreApi) {
                return coreApi.userauth.add(obj);
              })
              .then(function (resp) {
                $log.debug('added user credentials', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to add credentials.', e);
                deferred.reject(e);
              });
            return deferred.promise;
          },
          updatePassword: function (username, oldPassword, newPassword) {
            var deferred = $q.defer();

            var obj = {
              data: {
                username: username,
                oldPassword: oldPassword,
                newPassword: newPassword
              }
            };
            riseAPILoader().then(function (coreApi) {
                return coreApi.userauth.updatePassword(obj);
              })
              .then(function (resp) {
                $log.debug('update user credentials resp', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to update credentials.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          login: function (username, password) {
            var deferred = $q.defer();

            var obj = {
              data: {
                username: username,
                password: password
              }
            };
            riseAPILoader().then(function (coreApi) {
                return coreApi.userauth.login(obj);
              })
              .then(function (resp) {
                $log.debug('login successful', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to login user.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          refreshToken: function (username, token) {
            var deferred = $q.defer();

            var obj = {
              data: {
                token: token
              }
            };
            riseAPILoader().then(function (coreApi) {
                return coreApi.userauth.refreshToken(obj);
              })
              .then(function (resp) {
                $log.debug('token refresh successful', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to refresh token.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          confirmUserCreation: function (username, userConfirmedToken) {
            var deferred = $q.defer();

            var obj = {
              data: {
                username: username,
                userConfirmedToken: userConfirmedToken
              }
            };
            riseAPILoader().then(function (coreApi) {
                return coreApi.userauth.confirmUserCreation(obj);
              })
              .then(function (resp) {
                $log.debug('Confirm user creation successful', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                $exceptionHandler(e, 'Failed to confirm account.', true);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          requestPasswordReset: function (username) {
            var deferred = $q.defer();

            var obj = {
              data: {
                username: username
              }
            };
            riseAPILoader().then(function (coreApi) {
                return coreApi.userauth.requestPasswordReset(obj);
              })
              .then(function (resp) {
                $log.debug('Request password reset successful', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to request password reset.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          resetPassword: function (username, passwordResetToken,
            newPassword) {
            var deferred = $q.defer();

            var obj = {
              data: {
                username: username,
                passwordResetToken: passwordResetToken,
                newPassword: newPassword
              }
            };
            riseAPILoader().then(function (coreApi) {
                return coreApi.userauth.resetPassword(obj);
              })
              .then(function (resp) {
                $log.debug('Reset password successful', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to reset password.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        };

        return service;
      }
    ]);
})();
