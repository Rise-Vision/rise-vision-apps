'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('SignInCtrl', ['userAuthFactory', '$state',
    function (userAuthFactory, $state) {

      userAuthFactory.authenticate(false).then(function () {
        $state.go('apps.launcher.home');
      }).then(null, function () {
        userAuthFactory.authenticate(true);
      });
    }
  ]);
