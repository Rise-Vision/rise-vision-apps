'use strict';

angular.module('risevision.common.components.userstate')
  .controller('ConfirmAccountCtrl', ['$scope', '$loading', '$exceptionHandler',
    '$stateParams', 'userauth', 'getError',
    function ($scope, $loading, $exceptionHandler, $stateParams, userauth, getError) {
      $scope.username = $stateParams.user;

      $loading.startGlobal('auth-confirm-account');

      userauth.confirmUserCreation($stateParams.user, $stateParams.token)
        .catch(function (e) {
          var error = getError(e);
          $scope.apiError = error.message || 
            'Please refresh this page or <a target="_blank" href="mailto:support@risevision.com">reach out to our Support team</a> if the problem persists.';

          $exceptionHandler(e, 'Failed to confirm account.', true);
        })
        .finally(function () {
          $loading.stopGlobal('auth-confirm-account');
        });
    }
  ]);
