'use strict';

angular.module('risevision.displays.services')
  .factory('loadOldPrimus', ['$q', '$window', 'OLD_MESSAGING_URL', function ($q,
    $window, OLD_MESSAGING_URL) {
    return {
      create: function () {
        var deferred = $q.defer();
        var primus = new $window.PrimusOldMS(OLD_MESSAGING_URL, {
          reconnect: {
            retries: 0
          }
        });

        deferred.resolve(primus);
        return deferred.promise;
      }
    };
  }])

  .factory('loadPrimus', ['$q', '$window', 'MESSAGING_PRIMUS_URL', function ($q,
    $window, MESSAGING_PRIMUS_URL) {
    return {
      create: function () {
        var deferred = $q.defer();
        var primus = new $window.Primus(MESSAGING_PRIMUS_URL, {
          reconnect: {
            retries: 0
          }
        });

        deferred.resolve(primus);
        return deferred.promise;
      }
    };
  }])

  .factory('displayStatusFactory', ['loadOldPrimus', '$q', '$http', '$timeout', 'processErrorCode', 'MESSAGING_PRESENCE_URL',
  function (loadOldPrimus, $q, $http, $timeout, processErrorCode, MESSAGING_PRESENCE_URL) {
    var factory = {
      apiError: null
    };

    factory.getDisplayStatus = function (displayIds) {
      var deferred = $q.defer();

      factory.apiError = null;

      loadOldPrimus.create()
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
        });

      return deferred.promise
        .then(function (oldMSResults) {
          return factory.checkNewMSPresence(displayIds, oldMSResults);
        })
        .catch(function (err) {
          console.log('Error checking presence on the legacy messaging service', err);
          return factory.checkNewMSPresence(displayIds, []);
        });
    };

    factory.checkNewMSPresence = function (displayIds, oldMSResults) {
      var deferred = $q.defer();

      $http.post(MESSAGING_PRESENCE_URL, displayIds)
        .then(function (resp) {
          var presenceData = resp.data;

          var merge = displayIds.map(function (id) {
            var idStatus = {};
            idStatus[id] = isConnectedToNew(id) || isConnectedToOld(id);

            if (idStatus[id]) {
              idStatus.lastConnectionTime = Date.now();
            } else {
              idStatus.lastConnectionTime = lastConnectionNew(id) || lastConnectionOld(id);
            }

            return idStatus;
          });

          deferred.resolve(merge);

          function isConnectedToNew(id) {
            return presenceData[id] && presenceData[id].connected === true;
          }

          function isConnectedToOld(id) {
            for (var i = 0; i < oldMSResults.length; i++) {
              if (oldMSResults[i][id]) {
                return true;
              }
            }

            return false;
          }

          function lastConnectionNew(id) {
            return Number(presenceData[id].lastConnection);
          }

          function lastConnectionOld(id) {
            for (var i = 0; i < oldMSResults.length; i++) {
              if (oldMSResults[i][id] !== undefined) {
                return oldMSResults[i].lastConnectionTime;
              }
            }
          }
        })
        .catch(function (err) {
          factory.errorMessage = 'Failed to load displays connection status.';
          factory.apiError = processErrorCode('Status', 'load', err);
          deferred.reject(err);
        });

      return deferred.promise;
    };

    return factory;
  }])

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
