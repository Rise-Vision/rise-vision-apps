'use strict';

angular.module('risevision.common.components.userstate')
  .controller('ResetPasswordConfirmCtrl', ['$scope', '$loading', '$log',
    '$state', '$stateParams', 'userauth',
    function ($scope, $loading, $log, $state, $stateParams, userauth) {
      $scope.forms = {};
      $scope.credentials = {};
      $scope.errors = {};

      function _resetErrorStates() {
        $scope.emailResetSent = false;
        $scope.invalidToken = false;
      }

      $scope.resetPassword = function () {
        _resetErrorStates();

        if ($scope.forms.resetPasswordForm.$valid) {
          $loading.startGlobal('auth-reset-password');
          userauth.resetPassword($stateParams.user, $stateParams.token, $scope.credentials
              .newPassword)
            .then(function () {
              $log.log('Password updated');
              $state.go('common.auth.unauthorized', {
                passwordReset: true
              });
            })
            .catch(function (err) {
              var error = err.result && err.result.error && err.result.error.message;

              if (error === 'Password reset token does not match') {
                $scope.invalidToken = true;
              } else {
                console.error(err);
              }
            })
            .finally(function () {
              $loading.stopGlobal('auth-reset-password');
            });
        }
      };

      $scope.requestPasswordReset = function () {
        _resetErrorStates();

        $loading.startGlobal('auth-request-password-reset');
        userauth.requestPasswordReset($stateParams.user)
          .then(function () {
            $log.log('Email sent');
            $scope.emailResetSent = true;
          })
          .catch(function (err) {
            console.error(err);
          })
          .finally(function () {
            $loading.stopGlobal('auth-request-password-reset');
          });
      };
    }
  ]);
