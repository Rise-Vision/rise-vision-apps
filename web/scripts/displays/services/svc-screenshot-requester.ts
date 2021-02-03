'use strict';

angular.module('risevision.displays.services')
  .factory('screenshotRequester', ['loadPrimus', '$q', '$timeout', function (
    loadPrimus, $q, $timeout) {
    return function (coreRequester) {
      var deferred = $q.defer();

      loadPrimus.create()
        .then(function (primus) {
          var timer = $timeout(function () {
            primus.end();
            deferred.reject('timeout');
          }, 10000);

          primus.on('data', function (data) {
            if (data.msg === 'client-connected') {
              coreRequester(data.clientId)
                .then(null, function (err) {
                  primus.end();
                  deferred.reject(err);
                });
            } else if (data.msg === 'screenshot-saved') {
              $timeout.cancel(timer);
              primus.end();
              deferred.resolve(data);
            } else if (data.msg === 'screenshot-failed') {
              $timeout.cancel(timer);
              primus.end();
              deferred.reject('screenshot-failed');
            }
          });

          primus.on('error', function rej(err) {
            primus.end();
            $timeout.cancel(timer);
            deferred.reject(err);
          });
        });

      return deferred.promise;
    };
  }]);
