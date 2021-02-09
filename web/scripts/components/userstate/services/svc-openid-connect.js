(function (angular) {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    .value('CLIENT_ID', '614513768474.apps.googleusercontent.com')
    .value('OAUTH2_SCOPES', 'email profile')

    .factory('openidConnectLoader', ['$q', '$window', 'localStorageService', 'userState',
      'CLIENT_ID', 'OAUTH2_SCOPES',
      function ($q, $window, localStorageService, userState, CLIENT_ID, OAUTH2_SCOPES) {
        if (!$window.Oidc || !localStorageService.isSupported) {
          return function () {
            return $q.reject('Oidc client not found!');
          };
        }

        var Oidc = $window.Oidc;

        Oidc.Log.logger = console;
        Oidc.Log.level = Oidc.Log.WARN;

        var service = {};
        var loc = $window.location.origin + '/';

        var settings = {
          authority: 'https://accounts.google.com/',
          client_id: CLIENT_ID,
          response_type: 'token id_token',
          scope: OAUTH2_SCOPES,
          prompt: 'select_account',
          redirect_uri: loc,
          post_logout_redirect_uri: loc + 'oidc-client-sample.html',

          silent_redirect_uri: loc + 'user-manager-silent.html',
          automaticSilentRenew: true,
          includeIdTokenInSilentRenew: false,

          filterProtocolClaims: true,
          loadUserInfo: true,

          userStore: new Oidc.WebStorageStateStore({ store: $window.localStorage }),
          extraQueryParams: {
            access_type: 'online'
          }
        };
        var client = new Oidc.UserManager(settings);

        var _signinSilent = client.signinSilent.bind(client);

        client.signinSilent = function(params) {
          if (!params) {
            params = {
              login_hint: userState.getUsername()
            };
          }

          return _signinSilent(params);
        };

        return function () {
          return $q.resolve(client);
        };
      }
    ])

    .factory('openidConnect', ['$q', '$log', 'openidConnectLoader', 'openidTracker',
      function ($q, $log, openidConnectLoader, openidTracker) {
        var service = {};

        openidConnectLoader()
          .then(function(client) {
            var trackOpenidEvent = function(openidEventType, eventProperties) {
              return client.getUser()
                .then(function(user) {
                  openidTracker(openidEventType, user ? user.profile : {}, eventProperties);
                });
            };

            client.events.addUserLoaded(function(user) {
              openidTracker('user loaded', user.profile);
            });
            client.events.addUserUnloaded(function() {
              trackOpenidEvent('user unloaded');
            });
            client.events.addAccessTokenExpiring(function() {
              trackOpenidEvent('access token expiring');
            });
            // Temporarily removed to avoid sending too many events
            // client.events.addAccessTokenExpired(function() {
            //   trackOpenidEvent('access token expired');
            // });
            client.events.addSilentRenewError(function(error) {
              trackOpenidEvent('silent renew error', {errorMessage: error.message});
            });
            client.events.addUserSignedOut(function() {
              trackOpenidEvent('user signed out');
            });
          });

        service.getUser = function() {
          return openidConnectLoader()
            .then(function(client) {
              return client.getUser();
            })
            .then(function(user) {
              console.log('get user response', user);

              return user;
            }).catch(function(err) {
              console.log(err);

              throw err;
            });
        };

        service.signinRedirect = function(state) {
          return openidConnectLoader()
            .then(function(client) {
              openidTracker('sign in redirect started');
              return client.signinRedirect({ state: state });
            })
            .then(function(resp) {
              console.log('signin redirect response', resp);
            }).catch(function(err) {
              console.log(err);

              throw err;
            });
        };

        service.signinRedirectCallback = function(location) {
          return openidConnectLoader()
            .then(function(client) {
              return client.signinRedirectCallback(location);
            })
            .then(function(user) {
              console.log('signin redirect response', user);

              return user;
            }).catch(function(err) {
              $log.error('Authentication Error from Redirect: ', err);

              throw err;
            });
        };

        service.signinPopup = function() {
          return $q.reject('Not implemented');
        };

        service.signinSilent = function(username) {
          if (!username) {
            return $q.reject('Missing user id');
          }

          return openidConnectLoader()
            .then(function(client) {
              return client.signinSilent({ 
                login_hint: username
              });
            })
           .then(function(user) {
              console.log('signin silent response', user);

              return user;
            }).catch(function(err) {
              console.log(err);

              throw err;
            });
        };

        service.removeUser = function() {
          return openidConnectLoader()
            .then(function(client) {
              return client.removeUser();
            });
        };

        return service;
      }
    ]);

})(angular);
