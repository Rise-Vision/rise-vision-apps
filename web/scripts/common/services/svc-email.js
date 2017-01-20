'use strict';

angular.module('risevision.apps.services')
  .constant('EMAIL_FROM', 'support@risevision.com')
  .constant('EMAIL_FROM_NAME', 'Rise Vision Support')
  .service('email', ['$q', '$log', 'riseAPILoader',
    'EMAIL_FROM', 'EMAIL_FROM_NAME',
    function ($q, $log, riseAPILoader, EMAIL_FROM, EMAIL_FROM_NAME) {

      var service = {
        send: function (recipients, subject, text) {
          var deferred = $q.defer();

          var obj = {
            'from': EMAIL_FROM,
            'fromName': EMAIL_FROM_NAME,
            'recipients': recipients,
            'subject': subject,
            'data': {
              'text': text
            }
          };
          riseAPILoader().then(function (riseApi) {
              return riseApi.email.send(obj);
            })
            .then(function (resp) {
              $log.debug('email sent', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error('Failed to send email.', e);
              deferred.reject(e);
            });
          return deferred.promise;
        }
      };

      return service;
    }
  ]);
