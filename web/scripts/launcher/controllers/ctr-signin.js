'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('SignInCtrl', ['userState', '$state',
    function (userState, $state) {

      userState.authenticate(false).then(function () {
        $state.go('apps.launcher.home');
      }).then(null, function () {
        userState.authenticate(true);
      });
    }
  ]);
