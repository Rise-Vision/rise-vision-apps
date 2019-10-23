'use strict';

angular.module('risevision.schedules.services')
  .factory('responseHeaderAnalyzer', ['$log', '$http', '$q',
    function ($log, $http, $q) {

      var factory = {};

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


      factory.validate = function (url) {
        var message =
          'The owner of the Web Page at the URL provided does not allow the page to be embedded within an iFrame. If possible, please contact the Web Page owner to discuss ';
        var deferred = $q.defer();

        factory.getOptions(url).then(function (options) {
          if (options.includes('frame-ancestors')) {
            deferred.reject(message +
              ' (<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors">content-security-policy / frame-ancestors</a>).'
            );
          } else if (options.includes('X-Frame-Options')) {
            deferred.reject(message +
              ' (<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options">X-Frame-Options</a>).'
            );
          } else {
            deferred.resolve(true);
          }
        }).catch(function (response) {
          deferred.reject('Could not reach URL. Error ' + response.status + ': ' + response.statusText);
        });
        return deferred.promise;
      };


      function extractOptionsFrom(response) {
        var header,
          options = [];

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
