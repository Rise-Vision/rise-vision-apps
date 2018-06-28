'use strict';

angular.module('risevision.displays.services')
  .factory('screenshotRequester', ['loadOldPrimus', 'loadPrimus', '$q', '$timeout', function (
    loadOldPrimus, loadPrimus, $q, $timeout) {
    return function (coreRequester) {
      var deferred = $q.defer();

      loadOldPrimus.create()
        .then(function (oldPrimus) {
          loadPrimus.create()
            .then(function (primus) {
              var timer = $timeout(function () {
                oldPrimus.end();
                primus.end();
                deferred.reject('timeout');
              }, 10000);

              oldPrimus.on('data', function (data) {
                if (data.msg === 'client-connected') {
                  coreRequester(data.clientId)
                    .then(null, function (err) {
                      oldPrimus.end();
                      primus.end();
                      deferred.reject(err);
                    });
                } else if (data.msg === 'screenshot-saved') {
                  $timeout.cancel(timer);
                  oldPrimus.end();
                  primus.end();
                  deferred.resolve(data);
                } else if (data.msg === 'screenshot-failed') {
                  oldPrimus.end();
                  primus.end();
                  deferred.reject('screenshot-failed');
                }
              });

              primus.on('data', function (data) {
                if (data.msg !== 'screenshot-saved' &&
                  data.msg !== 'screenshot-failed' &&
                  data.msg !== 'client-connected') {
                  return;
                }
                oldPrimus.emit('data', data);
              });

              oldPrimus.on('error', function rej(err) {
                oldPrimus.end();
                deferred.reject(err);
              });

              primus.on('error', function rej(err) {
                primus.end();
              });
            });
        });

      return deferred.promise;
    };
  }]);
