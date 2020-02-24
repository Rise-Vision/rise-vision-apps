'use strict';

angular.module('risevision.template-editor.services')
  .constant('VERIFY_CREDENTIALS', 'verify-credentials')
  .service('twitterCredentialsValidation', ['$q', '$http', '$window', '$log', 'TWITTER_SERVICE_URL', 'VERIFY_CREDENTIALS',
    function ($q, $http, $window, $log, TWITTER_SERVICE_URL, VERIFY_CREDENTIALS) {
      var factory = {};

      factory.verifyCredentials = function (companyId) {
        var deferred = $q.defer();

        $http({
          url: TWITTER_SERVICE_URL + VERIFY_CREDENTIALS,
          method: 'GET',
          params: {
            companyId: companyId
          }
        }).then(function (response) {
          if (response && response.data) {
            deferred.resolve(response.data.success);
          }
        }, function (err) {
          $log.error('Failed to verify twitter credentials.', err);
          deferred.reject(err);
        });

        return deferred.promise;
      };

      return factory;
    }
  ]);
