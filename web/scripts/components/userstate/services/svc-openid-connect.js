(function (angular) {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    .factory('openidConnect', ['$window', '$location', 'userState',
      function ($window, $location, userState) {
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

        service.signIn = function(state) {
          client.signinRedirect({ state: state }).then(function(req) {
            console.log('signin request', req);

            $window.location.href = req.url;
          }).catch(function(err) {
            console.log(err);
          });
        };

        service.signInSilent = function(state) {
          return client.signinSilent({ 
            state: state,
            // login_hint: userState.getUsername()
           }).then(function(response) {
              console.log('signin response', response);
              
              return response.id_token;
          }).catch(function(err) {
              console.log(err);
          });
        };

        service.processSigninResponse = function() {
          return client.signinRedirectCallback().then(function(user) {
              console.log('signin response', user);
              
              return user.id_token;
          }).catch(function(err) {
              console.log(err);
          });
        };

        return service;
      }
    ]);

})(angular);
