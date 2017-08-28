'use strict';

angular.module('risevision.displays.services')
  .value('LATEST_PLAYER_URL', 'https://storage.googleapis.com/install-versions.risevision.com/latest-version')
  .factory('parsePlayerDate', function() {
    return function (dateString) {
      var dt = (dateString || '').split(".");
      
      if (dt.length === 5) {
        return new Date(dt[0], Number(dt[1]) - 1, dt[2], dt[3], dt[4], 0, 0);
      }
      else {
        return null;
      }
    };
  })
  .factory('getLatestPlayerVersion', ['$http', '$q', 'parsePlayerDate', 'LATEST_PLAYER_URL',
    function ($http, $q, parsePlayerDate, LATEST_PLAYER_URL) {
      return function () {
        var deferred = $q.defer();
        
        $http.get(LATEST_PLAYER_URL)
        .then(function (resp) {
          var tokens = (resp.data || '').split(' ');
  
          if (tokens.length === 2) {
            var date = parsePlayerDate(tokens[1]);

            if(date) {
              deferred.resolve(date);
            }
            else {
              deferred.reject("Invalid date format" + tokens[1]);
            }
          }
          else {
            deferred.reject("Missing fields: " + resp.data);
          }
        })
        .catch(function (err) {
          deferred.reject(err);
        });
  
        return deferred.promise;
      };
    }
  ]);
