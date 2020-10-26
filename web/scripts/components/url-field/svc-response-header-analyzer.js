'use strict';

angular.module('risevision.widget.common.url-field.response-header-analyzer', [])
  .factory('responseHeaderAnalyzer', ['$log', '$http', '$q',
    function ($log, $http, $q) {
      //Ported from https://github.com/Rise-Vision/widget-web-page/blob/master/src/settings/svc-response-header-analyzer.js
      var factory = {};

      factory.validate = function (url) {
        var deferred = $q.defer();

        _requestHead(url)
          .then(function (response) {
            if (response && response.headers()) {
              $log.debug('URL headers:', response.headers());

              var contentType = response.headers('content-type');
              if (contentType && !_isAcceptedContentType(contentType)) {
                deferred.reject('content-type');
                return;
              }

              var options = _extractOptionsFrom(response);
              if (options.indexOf('frame-ancestors') > -1) {
                deferred.reject('frame-ancestors');
                return;
              } else if (options.indexOf('X-Frame-Options') > -1) {
                deferred.reject('X-Frame-Options');
                return;
              }
            }
            deferred.resolve(true);
          }).catch(function (response) {
            $log.debug('Webpage request failed with status code ' + response.status + ': ' + response.statusText);
            deferred.reject('not-reachable');
          });
        return deferred.promise;
      };

      var _requestHead = function (url) {
        return $http({
          method: 'HEAD',
          url: 'https://proxy.risevision.com/' + url
        });
      };

      var _extractOptionsFrom = function (response) {
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
      };

      var _isAcceptedContentType = function (contentType) {
        return contentType && contentType.match('(image\/|video\/|text\/|audio\/).*');
      };

      return factory;
    }
  ]);
