/*jshint camelcase: false */
/* globals OAuth */

'use strict';
angular.module('risevision.widgets.services')
  .factory('OAuthService', ['$http', 'environment', 'OAuthio', '$q', '$log', 'userState',
    function ($http, environment, OAuthio, $q, $log, userState) {
      var svc = {};
      var provider = '';
      var key = '';

      var _getRequestOptions = function () {
        var authorization = (userState.getAccessToken().token_type === 'Bearer') ? userState.getAccessToken()
          .token_type +
          ' ' + userState.getAccessToken().access_token : userState.getAccessToken().access_token;
        var requestOptions = {
          'headers': {
            'authorization': authorization
          },
          'withCredentials': true,
          'responseType': 'json'
        };

        return requestOptions;
      };

      svc.initialize = function (newProvider) {
        provider = newProvider;
      };

      var _getStatus = function () {
        var deferred = $q.defer();
        $http.post(environment.OAUTH_TOKEN_PROVIDER_URL + 'status', {
            'companyId': userState.getSelectedCompanyId(),
            'provider': provider
          }, _getRequestOptions())
          .then(function (response) {
            deferred.resolve(response);
          }, function (error) {
            deferred.reject(error);
            $log.debug('Could not get Status! ' + error);
          });
        return deferred.promise;
      };

      svc.getConnectionStatus = function () {
        var deferred = $q.defer();
        _getStatus()
          .then(function (response) {
            if (response.data && Array.isArray(response.data.authenticated) && response.data.authenticated
              .length) {
              key = userState.getSelectedCompanyId() + ':' + provider + ':' + response.data.authenticated[0];
              deferred.resolve(true);
            } else {
              deferred.reject(new Error('No authenticated on the response'));
            }
          }, function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      };

      var _getStateToken = function () {
        var deferred = $q.defer();
        $http.get(environment.OAUTH_TOKEN_PROVIDER_URL + 'authenticate', _getRequestOptions())
          .then(function (response) {
            if (response.data && response.data.token) {
              deferred.resolve(response.data.token);
            } else {
              deferred.reject(new Error('No Token'));
            }
          }, function (error) {
            deferred.reject(error);
            $log.debug('Could not get state token! ' + error);
          });
        return deferred.promise;
      };

      var _authenticateWithOauthIO = function (stateToken) {
        var deferred = $q.defer();
        OAuthio.popup(provider, stateToken)
          .then(function (result) {
            deferred.resolve(result.code);
          }, function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };

      var _authenticateWithOauthTokenProvider = function (code) {
        var deferred = $q.defer();
        $http.post(environment.OAUTH_TOKEN_PROVIDER_URL + 'authenticate', {
            'code': code,
            'companyId': userState.getSelectedCompanyId(),
            'provider': provider
          }, _getRequestOptions())
          .then(function (response) {
            if (response.data && response.data.key) {
              key = response.data.key;
              deferred.resolve(response.data.key);
            } else {
              deferred.reject(new Error('No Key'));
            }
          }, function (error) {
            deferred.reject(error);
            $log.debug('Could not authenticate with OAuth Token Provider! ' + error);
          });
        return deferred.promise;
      };

      svc.authenticate = function () {
        return _getStateToken()
          .then(_authenticateWithOauthIO)
          .then(_authenticateWithOauthTokenProvider);
      };

      svc.revoke = function () {
        var deferred = $q.defer();
        $http.post(environment.OAUTH_TOKEN_PROVIDER_URL + 'revoke', {
            'key': key
          }, _getRequestOptions())
          .then(function (response) {
            deferred.resolve(response.data);
          }, function (error) {
            deferred.reject(error);
            $log.debug('Could not revoke with OAuth Token Provider! ' + error);
          });
        return deferred.promise;
      };

      return svc;
    }
  ]);
