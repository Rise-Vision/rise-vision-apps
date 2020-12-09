(function (angular) {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    // constants (you can override them in your app as needed)
    .factory('googleAuthFactory', ['$rootScope', '$q', '$log', '$window',
      '$stateParams', 'auth2APILoader', 'uiFlowManager',
      'userState', 'urlStateService', 'openidConnect',
      function ($rootScope, $q, $log, $window, $stateParams, auth2APILoader,
        uiFlowManager, userState, urlStateService, openidConnect) {

        var _getUserProfile = function (authInstance) {
          if (!authInstance.currentUser) {
            return null;
          }

          var profile = authInstance.currentUser.get().getBasicProfile();

          var user = {
            id: profile.getId(),
            email: profile.getEmail(),
            picture: profile.getImageUrl()
          };

          return user;
        };

        var _gapiAuthorize = function () {
          var deferred = $q.defer();

          auth2APILoader()
            .then(function (auth2) {
              var authResult = auth2.getAuthInstance() &&
                auth2.getAuthInstance().isSignedIn.get();

              $log.debug('auth2.isSignedIn result:', authResult);
              if (authResult) {

                deferred.resolve(_getUserProfile(auth2.getAuthInstance()));
              } else {
                deferred.reject('Failed to authorize user (auth2)');
              }
            })
            .then(null, deferred.reject); //auth2APILoader

          return deferred.promise;
        };

        /*
         * Responsible for triggering the Google OAuth process.
         *
         */
        var authenticate = function () {
          var deferred = $q.defer();

          _gapiAuthorize()
            .then(function (oauthUserInfo) {
              if (userState._state.redirectState) {
                urlStateService.redirectToState(userState._state.redirectState);

                delete userState._state.redirectState;
              }

              deferred.resolve(oauthUserInfo);
            })
            .then(null, function (err) {
              deferred.reject(err);
            });

          return deferred.promise;
        };

        var _isPopupAuth = function () {
          return (userState._state.inRVAFrame || ($window.self !== $window.top));
        };

        var forceAuthenticate = function (silent) {
          var deferred = $q.defer();
          var loc;
          var redirectState = $stateParams.state;

          // Redirect to full URL path
          if ($rootScope.redirectToRoot === false) {
            loc = $window.location.href.substr(0, $window.location.href
              .indexOf('#')) || $window.location.href;

            redirectState = urlStateService.clearStatePath(redirectState);
          } else {
            loc = $window.location.origin + '/';
          }

          userState._state.redirectState = redirectState;
          userState._persistState();
          uiFlowManager.persist();


          if (silent) {
            openidConnect.signInSilent(redirectState);            
          } else {
            openidConnect.signIn(redirectState);
          }

          // var opts = {
          //   response_type: 'token',
          //   prompt: 'select_account',
          //   ux_mode: _isPopupAuth() ? 'popup' : 'redirect',
          //   redirect_uri: loc
          // };
          // 
          // $window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' +
          //    'scope=email%20profile&' +
          //    'access_type=online&' +
          //    'include_granted_scopes=true&' +
          //    // 'response_type=code&' +
          //    'response_type=token&' +
          //    'state=' + loc + '&' +
          //    (silent ? 'prompt=none&' : '') +
          //    // 'redirect_uri=http://localhost:8000/&' +
          //    'redirect_uri=' + loc + '&' +
          //    // 'nonce=' + Math.floor((Math.random() * 10000) + 1) + '&' +
          //    (silent ? 'login_hint=' + userState.getUsername() + '&' : '') +
          //    // 'redirect_uri=https://google-oauth2-dot-rvacore-test.appspot.com/oauth2callback&' +
          //    // 'client_id=614513768474-dnnhi8e6b8motn6i5if2ur05g6foskoc.apps.googleusercontent.com';
          //    'client_id=614513768474.apps.googleusercontent.com';
          // 
          // return;

          // auth2APILoader()
          //   .then(function (auth2) {
          //     return auth2.getAuthInstance().signIn(opts);
          //   })
          //   .then(function () {
          //     if (_isPopupAuth()) {
          //       deferred.resolve(authenticate());
          //     } else {
          //       deferred.resolve();
          //     }
          //   })
          //   .then(null, function (err) {
          //     deferred.reject(err);
          //   });
          // 
          // return deferred.promise;
        };

        var googleAuthFactory = {
          authenticate: function (forceAuth, silent) {
            if (!forceAuth) {
              return authenticate();
            } else {
              return forceAuthenticate(silent);
            }
          }
        };

        return googleAuthFactory;
      }
    ]);

})(angular);
