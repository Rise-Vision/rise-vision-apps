'use strict';

angular.module('risevision.displays.services')
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
        .catch(function (err) {
          console.log('Error checking presence on the legacy messaging service', err);
          return [];
        })
        .then(function (oldMSResults) {
          return factory.checkNewMSPresence(displayIds, oldMSResults);
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
  }]);
