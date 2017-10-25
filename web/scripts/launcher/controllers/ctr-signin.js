'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('SignInCtrl', ['canAccessApps', '$state',
    function (canAccessApps, $state) {

      canAccessApps(true).then(function () {
        $state.go('apps.launcher.home');
      });
    }
  ]);
