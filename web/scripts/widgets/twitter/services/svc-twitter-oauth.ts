'use strict';
angular.module('risevision.widgets.twitter')
  .factory('TwitterOAuthService', ['OAuthService',
    function (OAuthService) {
      var svc = {};
      OAuthService.initialize('twitter');
      svc.getConnectionStatus = OAuthService.getConnectionStatus;
      svc.authenticate = OAuthService.authenticate;
      svc.revoke = OAuthService.revoke;

      return svc;
    }
  ]);
