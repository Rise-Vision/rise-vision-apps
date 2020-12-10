(function (angular) {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    // .value('CLIENT_ID', '614513768474.apps.googleusercontent.com')
    .value('CLIENT_ID', '614513768474-dnnhi8e6b8motn6i5if2ur05g6foskoc.apps.googleusercontent.com')
    .value('OAUTH2_SCOPES', 'email profile')
    .factory('openidConnect', ['$q', '$window', 'userState',
      'CLIENT_ID', 'OAUTH2_SCOPES',
      function ($q, $window, userState, CLIENT_ID, OAUTH2_SCOPES) {
        var Oidc = $window.Oidc;

        Oidc.Log.logger = console;
        Oidc.Log.level = Oidc.Log.INFO;

        var service = {};
        var loc = $window.location.origin + '/';

        var settings = {
          authority: 'https://accounts.google.com/',
          client_id: CLIENT_ID,
          response_type: 'token id_token',
          scope: OAUTH2_SCOPES,
          redirect_uri: loc,
          post_logout_redirect_uri: loc + 'oidc-client-sample.html',

          silent_redirect_uri: loc + 'user-manager-silent.html',
          automaticSilentRenew: true,
          includeIdTokenInSilentRenew: false,

          filterProtocolClaims: true,
          loadUserInfo: true,

          userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
          extraQueryParams: {
            access_type: 'online'
          }
        };
        var client = new Oidc.UserManager(settings);

        client.events.addUserLoaded(function(args) {
          console.log(`OIDC Client - user loaded: ${JSON.stringify(args)}`);
        });
        client.events.addUserUnloaded(function(args) {
          console.log(`OIDC Client - user unloaded: ${JSON.stringify(args)}`);
        });
        client.events.addAccessTokenExpiring(function(args) {
          console.log(`OIDC Client - access token expiring: ${JSON.stringify(args)}`);
        });
        client.events.addAccessTokenExpired(function(args) {
          console.log(`OIDC Client - access token expired: ${JSON.stringify(args)}`);
        });
        client.events.addSilentRenewError(function(args) {
          console.log(`OIDC Client - silent renew error: ${JSON.stringify(args)}`);
        });
        client.events.addUserSignedOut(function(args) {
          console.log(`OIDC Client - user signed out: ${JSON.stringify(args)}`);
        });

        service.getUser = function() {
          return client.getUser()
            .then(function(user) {
              console.log('get user request', user);

              return user;
            }).catch(function(err) {
              console.log(err);

              throw err;
            });
        };

        service.signinRedirect = function(state) {
          return client.signinRedirect({ state: state })
            .then(function(req) {
              console.log('signin redirect request', req);
            }).catch(function(err) {
              console.log(err);

              throw err;
            });
        };

        service.signinRedirectCallback = function() {
          return client.signinRedirectCallback()
            .then(function(user) {
              console.log('signin redirect response', user);

              return user;
            }).catch(function(err) {
              console.log(err);

              throw err;
            });
        };

        service.signinPopup = function() {
          return $q.reject('Not implemented');
        };

        var _signinSilent = client.signinSilent.bind(client);

        client.signinSilent = function(params) {
          if (!params) {
            params = {
              login_hint: userState.getUsername()
            };
          }

          return _signinSilent(params);
        };

        service.signinSilent = function(user) {
          return client.signinSilent({
            login_hint: user.profile.sub
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
          return client.removeUser();
        };

        return service;
      }
    ]);

})(angular);
