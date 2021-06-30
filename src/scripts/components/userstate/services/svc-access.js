'use strict';

angular.module('risevision.common.components.userstate')
  .factory('canAccessApps', ['$q', '$state',
    'userState', 'userAuthFactory', 'urlStateService',
    function ($q, $state, userState, userAuthFactory, urlStateService) {
      return function (signup, allowReturn) {
        return userAuthFactory.authenticate(false)
          .then(function () {
            if (!userState.isRiseVisionUser()) {
              return $q.reject();
            }
          })
          .catch(function () {
            var newState;

            if (!userState.isLoggedIn()) {
              if (signup) {
                newState = 'common.auth.createaccount';
              } else {
                newState = 'common.auth.unauthorized';
              }
            } else if ($state.get('common.auth.unregistered')) {
              newState = 'common.auth.unregistered';
            }

            if (newState) {
              $state.go(newState, {
                state: urlStateService.get()
              }, {
                reload: true,
                location: allowReturn ? true : 'replace'
              });

              return $q.reject('unauthenticated');
            }
          });
      };
    }
  ]);
