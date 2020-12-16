(function (angular) {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    .factory('googleAuthFactory', ['$rootScope', '$q', '$log', '$window',
      '$stateParams', 'gapiLoader', 'uiFlowManager',
      'userState', 'urlStateService', 'openidConnect',
      function ($rootScope, $q, $log, $window, $stateParams, gapiLoader,
        uiFlowManager, userState, urlStateService, openidConnect) {

        var _setToken = function (user) {
          return gapiLoader().then(function (gApi) {
            var token = {
              access_token: user.id_token,
              expires_in: '3600',
              token_type: 'Bearer'
            };

            gApi.auth.setToken(token);
          });
        };

        var _getUserProfile = function (currentUser) {
          if (!currentUser) {
            return null;
          }

          var profile = currentUser.profile;

          var user = {
            id: profile.sub,
            email: profile.email,
            picture: profile.picture
          };

          return user;
        };

        /*
         * Responsible for triggering the Google OAuth process.
         *
         */
        var authenticate = function () {
          return openidConnect.getUser()
            .then(function(user) {
              if (user) {
                // Silent means we actually perform the check with API
                if (user.expires_in < 60) {
                  return openidConnect.signinSilent(user.profile.sub);
                } else {
                  return $q.resolve(user);
                }
              } else if (userState._state.userToken) {
                return openidConnect.signinSilent(userState._state.userToken.id);
              } else {
                return $q.reject('No user');
              }
            })
            .then(function(user) {
              _setToken(user);

              if (userState._state.redirectState) {
                urlStateService.redirectToState(userState._state.redirectState);

                delete userState._state.redirectState;
              }

              return _getUserProfile(user);
            })
            .catch(function (err) {
              return $q.reject(err);
            });
        };

        var _isPopupAuth = function () {
          return (userState._state.inRVAFrame || ($window.self !== $window.top));
        };

        var forceAuthenticate = function () {
          if (_isPopupAuth()) {
            return openidConnect.signinPopup();
          } else {
            var redirectState = $stateParams.state;

            // Redirect to full URL path
            if ($rootScope.redirectToRoot === false) {
              redirectState = urlStateService.clearStatePath(redirectState);
            }

            userState._state.redirectState = redirectState;
            userState._persistState();
            uiFlowManager.persist();

            return openidConnect.signinRedirect(redirectState);
          }
        };

        var signOut = function(signOutGoogle) {
          if (signOutGoogle) {
            $window.logoutFrame.location = 'https://accounts.google.com/Logout';
          }

          return openidConnect.removeUser();
        };

        var googleAuthFactory = {
          authenticate: authenticate,
          forceAuthenticate: forceAuthenticate,
          signOut: signOut
        };

        return googleAuthFactory;
      }
    ]);

})(angular);
