(function (angular) {
  'use strict';

  angular.module('risevision.common.components.userstate')
    .value('FORCE_GOOGLE_AUTH', false)
    .factory('userAuthFactory', ['$q', '$log', '$location',
      '$rootScope', '$loading', '$window', '$document',
      'objectHelper', 'rvTokenStore', 'externalLogging',
      'userState', 'googleAuthFactory', 'customAuthFactory',
      'FORCE_GOOGLE_AUTH',
      function ($q, $log, $location, $rootScope, $loading, $window,
        $document, objectHelper,
        rvTokenStore, externalLogging, userState, googleAuthFactory,
        customAuthFactory, FORCE_GOOGLE_AUTH) {

        var _state = userState._state;

        var _authorizeDeferred, _authenticateDeferred;

        var _shouldLogPageLoad = true;

        var _logPageLoad = function (details) {
          if (_shouldLogPageLoad) {
            _shouldLogPageLoad = false;
            try {
              var duration = new Date().getTime() - $window.performance
                .timing.navigationStart;
              externalLogging.logEvent('page load time', details,
                duration,
                userState.getUsername(), userState.getSelectedCompanyId()
              );
            } catch (e) {
              $log.debug('Error logging load time');
            }
          }
        };

        var _setUserToken = function (userToken) {
          _state.userToken = userToken;
          rvTokenStore.write(_state.userToken);
        };

        var _deleteUserToken = function (userToken) {
          delete _state.userToken;
          rvTokenStore.clear();
        };

        var _cancelAccessTokenAutoRefresh = function () {};

        var _resetUserState = function (signOutGoogle) {
          var promise = $q.resolve();

          if (!userState.isRiseAuthUser()) {
            promise = googleAuthFactory.signOut(signOutGoogle);
          }

          $log.debug('Clearing user token...');
          _cancelAccessTokenAutoRefresh();

          _deleteUserToken();

          userState._resetState();

          return promise;
        };

        var _detectUserOrAuthChange = function () {
          var token = rvTokenStore.read();
          if (!angular.equals(token, _state.userToken)) {
            $log.error('Authentication Failed. User token no longer matches stored token.');

            //token change indicates that user either signed in, or signed out, or changed account in other app
            $window.location.reload();
          } else if (_state.userToken) {
            _authenticateDeferred = null;

            // make sure user is not signed out
            authenticate().finally(function () {
              if (!_state.userToken) {
                $log.error('Authentication Failed. User no longer signed in.');

                $window.location.reload();
              }
            });
          }
        };

        var _visibilityListener = function () {
          var visibilityState;
          var document = $document[0];
          if (typeof document.hidden !== 'undefined') {
            visibilityState = 'visibilityState';
          } else if (typeof document.mozHidden !== 'undefined') {
            visibilityState = 'mozVisibilityState';
          } else if (typeof document.msHidden !== 'undefined') {
            visibilityState = 'msVisibilityState';
          } else if (typeof document.webkitHidden !== 'undefined') {
            visibilityState = 'webkitVisibilityState';
          }
          $log.debug('visibility: ' + document[visibilityState]);
          if ('visible' === document[visibilityState]) {
            _detectUserOrAuthChange();
            $rootScope.$broadcast('risevision.page.visible', true);
          }
        };

        var _getVisibilityChangeName = function () {
          var visibilityChange;
          var document = $document[0];
          if (typeof document.hidden !== 'undefined') {
            visibilityChange = 'visibilitychange';
          } else if (typeof document.mozHidden !== 'undefined') {
            visibilityChange = 'mozvisibilitychange';
          } else if (typeof document.msHidden !== 'undefined') {
            visibilityChange = 'msvisibilitychange';
          } else if (typeof document.webkitHidden !== 'undefined') {
            visibilityChange = 'webkitvisibilitychange';
          }
          return visibilityChange;
        };

        var _addEventListenerVisibilityAPI = function () {
          document.addEventListener(_getVisibilityChangeName(),
            _visibilityListener);
        };

        var _removeEventListenerVisibilityAPI = function () {
          document.removeEventListener(_getVisibilityChangeName(),
            _visibilityListener);
        };

        /*
         * Responsible for triggering the Google OAuth process.
         *
         */
        var _authorize = function (authenticatedUser) {
          var attemptImmediate = false;

          if (_authorizeDeferred) {
            return _authorizeDeferred.promise;
          }

          if (authenticatedUser) {
            if (!_state.user.username || !_state.profile.username ||
              _state.user.username !== authenticatedUser.email) {
              _authorizeDeferred = $q.defer();

              //populate user
              objectHelper.clearAndCopy({
                userId: authenticatedUser
                  .id, //TODO: ideally we should not use real user ID or email, but use hash value instead
                username: authenticatedUser.email,
                picture: authenticatedUser.picture
              }, _state.user);

              _setUserToken(authenticatedUser);

              userState.refreshProfile()
                .catch(function (err) {
                  if (err && err.code !== 403) {
                    _authorizeDeferred.reject(err);

                    _authorizeDeferred = undefined;

                    return $q.reject();
                  }
                })
                .then(function () {
                  _authorizeDeferred.resolve();

                  $rootScope.$broadcast('risevision.user.authorized');

                  if (!attemptImmediate) {
                    $rootScope.$broadcast(
                      'risevision.user.userSignedIn');
                  }

                  _authorizeDeferred = undefined;
                });

              return _authorizeDeferred.promise;
            } else {
              return $q.resolve();
            }
          } else {
            return $q.reject('No user');
          }
        };

        var authenticate = function (forceAuth) {
          var authenticateDeferred;
          var authenticationPromise,
            isRiseAuthUser = false;

          // Clear User state
          if (forceAuth) {
            _authenticateDeferred = null;
          }

          // Return cached promise
          if (_authenticateDeferred) {
            return _authenticateDeferred.promise;
          } else {
            _authenticateDeferred = $q.defer();
          }

          // Always resolve local copy of promise
          // in case cached version is cleared
          authenticateDeferred = _authenticateDeferred;
          $log.debug('authentication called');

          if (forceAuth) {
            $loading.startGlobal('risevision.user.authenticate');
          }

          // Check for Token
          if (_state.userToken && _state.userToken.token && !FORCE_GOOGLE_AUTH) {
            isRiseAuthUser = true;
            authenticationPromise = customAuthFactory.authenticate();
          } else {
            authenticationPromise = googleAuthFactory.authenticate();
          }

          authenticationPromise
            .then(_authorize)
            .then(function () {
              userState._setIsRiseAuthUser(isRiseAuthUser);
              authenticateDeferred.resolve();
            })
            .catch(function (err) {
              $log.debug('Authentication Error: ', err);

              _resetUserState();

              authenticateDeferred.reject(err);
            })
            .finally(function () {
              _addEventListenerVisibilityAPI();

              $loading.stopGlobal('risevision.user.authenticate');

              _logPageLoad('authenticated user');
            });

          return authenticateDeferred.promise;
        };

        var signOut = function (signOutGoogle) {
          _authenticateDeferred = null;

          // The flag the indicates a user is potentially
          // authenticated already, must be destroyed.
          return _resetUserState(signOutGoogle)
            .finally(function() {
              //call google api to sign out
              $rootScope.$broadcast('risevision.user.signedOut');
              $log.debug('User is signed out.');              
            });
        };

        var userAuthFactory = {
          authenticate: authenticate,
          signOut: signOut,
          addEventListenerVisibilityAPI: _addEventListenerVisibilityAPI,
          removeEventListenerVisibilityAPI: _removeEventListenerVisibilityAPI,
        };

        return userAuthFactory;
      }
    ]);

})(angular);
