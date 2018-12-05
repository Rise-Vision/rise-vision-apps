'use strict';

angular.module('risevision.displays.services')
  .factory('displayStatusFactory', ['$q', '$http', '$timeout', 'processErrorCode',
    'MESSAGING_PRESENCE_URL',
    function ($q, $http, $timeout, processErrorCode, MESSAGING_PRESENCE_URL) {
      var factory = {
        apiError: null
      };

      factory.getDisplayStatus = function (displayIds) {
        var deferred = $q.defer();

        factory.apiError = null;

        return factory.checkMSPresence(displayIds);
      };

      factory.checkMSPresence = function (displayIds) {
        var deferred = $q.defer();

        $http.post(MESSAGING_PRESENCE_URL, displayIds)
          .then(function (resp) {
            var presenceData = resp.data;

            var merge = displayIds.map(function (id) {
              var idStatus = {};
              idStatus[id] = isConnected(id);

              if (idStatus[id]) {
                idStatus.lastConnectionTime = Date.now();
              } else {
                idStatus.lastConnectionTime = lastConnection(id) || '-';
              }

              return idStatus;
            });

            deferred.resolve(merge);

            function isConnected(id) {
              return presenceData[id] && presenceData[id].connected === true;
            }

            function lastConnection(id) {
              return Number(presenceData[id].lastConnection);
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
    }
  ]);
