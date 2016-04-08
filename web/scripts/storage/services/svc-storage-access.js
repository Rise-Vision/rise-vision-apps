'use strict';

angular.module('risevision.storage.services')
  .factory('canAccessStorage', ['$q', 'userState', '$state',
    function ($q, userState, $state) {
      return function () {
        var deferred = $q.defer();
        userState.authenticate(false).then(function () {
            if (userState.isRiseVisionUser()) {
              deferred.resolve();
            } else {
              return $q.reject();
            }
          })
          .then(null, function () {
            if (userState.isLoggedIn()) {
              $state.go('apps.launcher.unregistered');
            } else {
              $state.go('apps.storage.unauthorized');
            }
            deferred.reject();
          });
        return deferred.promise;
      };
    }
  ]);
