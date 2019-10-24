'use strict';

angular.module('risevision.widget.common.url-field.response-header-analyzer', [])
  .factory('responseHeaderAnalyzer', ['$log', '$http', '$q',
    function ($log, $http, $q) {
      //Ported from https://github.com/Rise-Vision/widget-web-page/blob/master/src/settings/svc-response-header-analyzer.js
      var factory = {};

      factory.validate = function (url) {
        var deferred = $q.defer();

        factory.getOptions(url).then(function (options) {
          if (options.indexOf('frame-ancestors') > -1) {
            deferred.reject('frame-ancestors');
          } else if (options.indexOf('X-Frame-Options') > -1) {
            deferred.reject('X-Frame-Options');
          } else {
            deferred.resolve(true);
          }
        }).catch(function () {
          deferred.reject('Could not reach URL.');
        });
        return deferred.promise;
      };

      factory.getOptions = function (url) {
        return $http({
          method: 'GET',
          url: 'https://proxy.risevision.com/' + url
        }).then(function (response) {
          if (!response) {
            return [];
          }
          $log.debug(response.headers());
          return response.headers() ? extractOptionsFrom(response) : [];
        }, function (response) {
          $log.debug('Webpage request failed with status code ' + response.status + ': ' + response.statusText);
          return [];
        });
      };

      function extractOptionsFrom(response) {
        var header;
        var options = [];
        header = response.headers('X-Frame-Options');
        if (header !== null && header.indexOf('ALLOW-FROM') === -1) {
          options.push('X-Frame-Options');
        }
        header = response.headers('content-security-policy');
        if (header !== null && header.indexOf('frame-ancestors') > 0) {
          options.push('frame-ancestors');
        }
        return options;
      }

      return factory;
    }
  ]);
