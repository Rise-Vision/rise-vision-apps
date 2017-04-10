'use strict';

angular.module('risevision.displays.services')
  .factory('loadPrimus', ['$q', '$window', 'MESSAGING_URL', function ($q,
    $window, MESSAGING_URL) {
    return {
      create: function () {
        var deferred = $q.defer();
        var Primus = $window['Primus'];
        var primus = new Primus(MESSAGING_URL, {
          reconnect: {
            retries: 0
          }
        });

        deferred.resolve(primus);
        return deferred.promise;
      }
    };
  }])

  .factory('getDisplayStatus', ['loadPrimus', '$q', '$timeout', function (
    loadPrimus, $q, $timeout) {
    return function (displayIds) {
      var deferred = $q.defer();

      loadPrimus.create()
        .then(function (primus) {
          var timer = $timeout(function () {
            primus.end();
            deferred.reject('timeout');
          }, 10000);

          primus.on('data', function (d) {
            if (d.msg === 'presence-result') {
              $timeout.cancel(timer);
              primus.end();
              deferred.resolve(d.result);
            }
          });

          primus.on('error', function rej(err) {
            primus.end();
            deferred.reject(err);
          });

          primus.on('open', function open() {
            primus.write({
              'msg': 'presence-request',
              'displayIds': displayIds
            });
          });

          primus.open();
        });

      return deferred.promise;
    };
  }])

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
              primus.end();
              deferred.reject('screenshot-failed');
            }
          });

          primus.on('error', function rej(err) {
            primus.end();
            deferred.reject(err);
          });

          primus.open();
        });

      return deferred.promise;
    };
  }]);
