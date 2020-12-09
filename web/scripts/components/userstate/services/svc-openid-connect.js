(function (angular) {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    .factory('openidConnect', ['$q', '$window', '$location', 'userState',
      function ($q, $window, $location, userState) {
        var Oidc = $window.Oidc;

        Oidc.Log.logger = console;
        Oidc.Log.level = Oidc.Log.INFO;

        var service = {};
        var loc = $window.location.origin + '/';

        var settings = {
          authority: 'https://accounts.google.com/',
          client_id: '614513768474-dnnhi8e6b8motn6i5if2ur05g6foskoc.apps.googleusercontent.com',
          redirect_uri: loc,
          post_logout_redirect_uri: loc + 'oidc-client-sample.html',
          silent_redirect_uri: loc + 'user-manager-silent.html',
          response_type: 'id_token',
          scope: 'openid email profile',

          filterProtocolClaims: true,
          loadUserInfo: true,

          extraQueryParams: {
            access_type: 'online'
          }
        };
        var client = new Oidc.UserManager(settings);

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

        service.signinSilent = function(user) {
          return client.signinSilent({ 
            // id_token_hint: null,
            // login_hint: user.profile.sub
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
