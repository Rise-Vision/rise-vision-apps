'use strict';

angular.module('risevision.template-editor.services')
  .constant('PROXY_URL', 'https://proxy.risevision.com/')
  .constant('VALIDATOR_URL', 'https://validator.w3.org/feed/check.cgi?url=')
  .constant('FEED_PARSER_URL', 'https://feed-parser.risevision.com/')
  .service('rssFeedValidation', ['$q', '$http', '$window', '$log', 'PROXY_URL', 'VALIDATOR_URL', 'FEED_PARSER_URL',
    function ($q, $http, $window, $log, PROXY_URL, VALIDATOR_URL, FEED_PARSER_URL) {
      var factory = {};

      factory.isValid = function (url) {
        if (!url) {
          return $q.resolve('');
        }

        var deferred = $q.defer();

        $http.get(PROXY_URL + VALIDATOR_URL + url + '&output=soap12')
          .then(function (response) {
            var parsed,
              validationResponse,
              isValid;

            if (response && response.data) {
              parsed = $window.xmlToJSON.parseString(response.data);
              validationResponse = parsed.Envelope[0].Body[0].feedvalidationresponse[0];

              isValid = validationResponse.validity[0]._text;

              return isValid ? deferred.resolve('VALID') : deferred.resolve('INVALID_FEED');
            }

          }, function (response) {
            $log.debug('Validation request failed with status code ' + response.status + ': ' + response
              .statusText);
            // assume it's valid
            return deferred.resolve('VALID');
          })
          .catch(function (err) {
            deferred.reject(err);
          });

        return deferred.promise;
      };

      factory.isParsable = function (url) {
        if (!url) {
          return $q.resolve('');
        }

        var deferred = $q.defer();

        $http.get(FEED_PARSER_URL + url)
          .then(function (response) {
            var error;

            if (response && response.data) {
              error = response.data.Error;

              if (!error) {
                return deferred.resolve('VALID');
              }

              if (error === '401 Unauthorized') {
                return deferred.resolve('UNAUTHORIZED');
              } else if (error === 'Not a feed') {
                return deferred.resolve('NON_FEED');
              } else if (error.indexOf('ENOTFOUND') !== -1 || error.indexOf('404') !== -1) {
                return deferred.resolve('NOT_FOUND');
              }

              // If neither of the errors above, assume the feed is parsable, as the error could regard a variety of reasons
              return deferred.resolve('VALID');
            }

            // assume it's parsable
            return deferred.resolve('VALID');

          }, function (response) {
            $log.debug('Feed parser check failed with status code ' + response.status + ': ' + response
              .statusText);

            // assume it's parsable
            return deferred.resolve('VALID');
          })
          .catch(function (err) {
            deferred.reject(err);
          });

        return deferred.promise;
      };

      return factory;
    }
  ]);
