'use strict';

angular.module('risevision.storage.services')
  .factory('canAccessStorage', ['$q', 'userState', 'userAuthFactory', '$state',
    function ($q, userState, userAuthFactory, $state) {
      return function () {
        var deferred = $q.defer();
        userAuthFactory.authenticate(false).then(function () {
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
