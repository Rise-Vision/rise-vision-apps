'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('SignInCtrl', ['canAccessApps', '$state',
    function (canAccessApps, $state) {

      canAccessApps().then(function () {
        $state.go('apps.launcher.home');
      });
    }
  ]);
