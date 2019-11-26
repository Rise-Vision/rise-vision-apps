'use strict';

angular.module('risevision.common.components.userstate')
  .controller('ConfirmAccountCtrl', ['$scope', '$loading', '$stateParams', 'userauth', 'getError',
    function ($scope, $loading, $stateParams, userauth, getError) {
      $scope.username = $stateParams.user;

      $loading.startGlobal('auth-confirm-account');

      userauth.confirmUserCreation($stateParams.user, $stateParams.token)
        .catch(function (e) {
          var error = getError(e);
          $scope.apiError = error.message || 
            'Please refresh this page or <a target="_blank" href="mailto:support@risevision.com">reach out to our Support team</a> if the problem persists.';
        })
        .finally(function () {
          $loading.stopGlobal('auth-confirm-account');
        });
    }
  ]);
