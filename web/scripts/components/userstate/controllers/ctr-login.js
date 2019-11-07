'use strict';

angular.module('risevision.common.components.userstate')
  .controller('LoginCtrl', ['$scope', '$loading', '$stateParams',
    '$state', 'userAuthFactory', 'customAuthFactory', 'uiFlowManager',
    'urlStateService', 'userState', 'FORCE_GOOGLE_AUTH',
    function ($scope, $loading, $stateParams, $state, userAuthFactory,
      customAuthFactory, uiFlowManager, urlStateService, userState,
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
      $scope.messages.accountConfirmed = $stateParams.accountConfirmed;

      $scope.googleLogin = function (endStatus) {
        $loading.startGlobal('auth-buttons-login');
        userAuthFactory.authenticate(true)
          .finally(function () {
            $loading.stopGlobal('auth-buttons-login');
            uiFlowManager.invalidateStatus(endStatus);
          });
      };

      var _authenticate = function() {
        return userAuthFactory.authenticate(true)
          .then(function() {
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
              } else if (err.status === 403) {
                $scope.errors.userAccountLockoutError = true;
              } else { // No special case for 404, for security reasons
                console.error(err);
                $scope.errors.loginError = true;
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
                $scope.errors.duplicateError = true;
              } else { // No special cases, for security reasons
                console.error(err);
                $scope.errors.signupError = true;
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
