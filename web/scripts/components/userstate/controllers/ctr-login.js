'use strict';

angular.module('risevision.common.components.userstate')
  .controller('LoginCtrl', ['$scope', '$loading', '$stateParams',
    '$state', '$exceptionHandler', 'userAuthFactory', 'customAuthFactory', 'uiFlowManager',
    'urlStateService', 'userState', 'getError', 'FORCE_GOOGLE_AUTH',
    function ($scope, $loading, $stateParams, $state, $exceptionHandler, userAuthFactory,
      customAuthFactory, uiFlowManager, urlStateService, userState, getError,
      FORCE_GOOGLE_AUTH) {
      $scope.forms = {};
      $scope.credentials = {};
      $scope.messages = {};
      $scope.errors = {};
      $scope.FORCE_GOOGLE_AUTH = FORCE_GOOGLE_AUTH;

      $scope.isSignUp = $stateParams.isSignUp;
      $scope.joinAccount = $stateParams.joinAccount;
      $scope.companyName = $stateParams.companyName;
      $scope.messages.passwordReset = $stateParams.passwordReset;

      var _processErrorCode = function (e, actionName) {
        var error = getError(e);
        var messageTitle = 'Oops, an error occurred while trying to sign you ' + actionName + '.';
        var message = error.message ? error.message :
          'Please try again or <a target="_blank" href="mailto:support@risevision.com">reach out to our Support team</a> if the problem persists.';

        if (e && e.status >= 400 && e.status < 500) {
          $scope.errors.genericError = true;
        } else if (e && (e.status === -1 || error.code === -1 || error.code === 0)) {
          $scope.errors.messageTitle = 'Hmm, we can\'t sign you ' + actionName +
            ' because there\'s a problem with your connectivity.';
          $scope.errors.message = 'Please check your connection and proxy or firewall settings and try again.';
        } else {
          // Catch all errors including !e, e.status === 500, e.status === 503, etc
          $scope.errors.messageTitle = messageTitle;
          $scope.errors.message = message;
        }
      };

      $scope.googleLogin = function (endStatus) {
        $loading.startGlobal('auth-buttons-login');
        userAuthFactory.authenticate(true)
          .finally(function () {
            $loading.stopGlobal('auth-buttons-login');
            uiFlowManager.invalidateStatus(endStatus);
          });
      };

      var _authenticate = function () {
        return userAuthFactory.authenticate(true)
          .then(function () {
            urlStateService.redirectToState($stateParams.state);
          });
      };

      $scope.customLogin = function (endStatus) {
        $scope.errors = {};
        $scope.messages = {};

        if ($scope.forms.loginForm.$valid) {
          $loading.startGlobal('auth-buttons-login');

          customAuthFactory.login($scope.credentials)
            .then(_authenticate)
            .catch(function (err) {
              if (err && err.status === 400) {
                $scope.messages.isGoogleAccount = true;
              } else if (err && err.status === 403) {
                $scope.errors.userAccountLockoutError = true;
              } else { // No special case for 404, for security reasons
                console.error(err);
                _processErrorCode(err, 'in');
              }
            })
            .finally(function () {
              $loading.stopGlobal('auth-buttons-login');
              uiFlowManager.invalidateStatus(endStatus);
            });
        }
      };

      $scope.createAccount = function (endStatus) {
        $scope.errors = {};
        $scope.messages = {};

        if ($scope.forms.loginForm.$valid) {
          $loading.startGlobal('auth-buttons-login');

          customAuthFactory.addUser($scope.credentials)
            .then(_authenticate)
            .catch(function (err) {
              if (err && err.status === 409) {
                $exceptionHandler(err, 'Account already Registered: ' + $scope.credentials.username, true);
                $scope.errors.duplicateError = true;
              } else { // No special cases, for security reasons
                $exceptionHandler(err, 'Failed to Create Account.', true);
                _processErrorCode(err, 'up');
              }
            })
            .finally(function () {
              $loading.stopGlobal('auth-buttons-login');
              uiFlowManager.invalidateStatus(endStatus);
            });
        }
      };
    }
  ]);
