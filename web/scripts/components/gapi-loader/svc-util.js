(function (angular) {
  'use strict';
  angular.module('risevision.common.components.util', [])

    .factory('humanReadableError', ['getError',
      function (getError) {
        return function (resp) {
          if (!resp) {
            return 'Unknown Error';
          }
          
          var error = getError(resp);
          var message = error.message || error;
          
          if (typeof message === 'string') {
            return message;
          } else {
            return JSON.stringify(message);
          }
        };
      }])

    .factory('dateIsInRange', [

      function () {
        /**
         * check if date is in range
         * @param {Date} date
         * @param {String} strStartDate
         * @param {String} strEndDate
         */
        return function (date, strStartDate, strEndDate) {
          // strStartDate, strEndDate can either be empty string or date in ISO 8601 format '2014-05-14T00:00:00.000Z'
          // empty means no there is no specific start or/and end date is set

          // When parsing time, we don't want to convert Universal time to the current TimeZone
          // example new Date(Date.parse('2014-05-14T00:00:00.000')); returns 'Tue May 13 2014 20:00:00 GMT-0400 (EDT)'
          // what we want is to pretend that date already comes adjusted to the current TimeZone
          // example '2014-05-14T00:00:00.000' show be converted to 'Tue May 14 2014 00:00:00 GMT-0400 (EDT)'

          var res = true;
          var re, dt;

          try {
            if (strStartDate) {
              re = strStartDate.match(/(\d{4})\-(\d{2})\-(\d{2})/);
              dt = new Date(re[1], parseInt(re[2]) - 1, re[3], 0, 0, 0, 0);
              res = (date >= dt);
            }

            if (res && strEndDate) {
              re = strEndDate.match(/(\d{4})\-(\d{2})\-(\d{2})/);
              dt = new Date(re[1], parseInt(re[2]) - 1, re[3], 0, 0, 0, 0);
              res = (date <= dt);
            }

          } catch (e) {
            res = false;
          }

          return res;

        };

      }
    ])

    .factory('objectHelper', [

      function () {
        var factory = {};

        factory.follow = function (source) {
          var Follower = function () {};
          Follower.prototype = source;
          return new Follower();
        };

        factory.clearObj = function (obj) {
          for (var member in obj) {
            delete obj[member];
          }
        };

        factory.clearAndCopy = function (src, dest) {
          factory.clearObj(dest);
          angular.extend(dest, src);
        };

        return factory;
      }
    ])

    .factory('getBaseDomain', ['$log', '$location',
      function ($log, $location) {
        var _looksLikeIp = function (addr) {
          if (/^([0-9])+\.([0-9])+\.([0-9])+\.([0-9])+$/.test(addr)) {
            return (true);
          }
          return (false);
        };

        return function () {
          var result;
          if (!result) {
            var hostname = $location.host();

            if (_looksLikeIp(hostname)) {
              result = hostname;
            } else {
              var parts = hostname.split('.');
              if (parts.length > 1) {
                // Somehow, cookies don't persist if we set the domain to appspot.com. 
                // It requires a sub-domain to be set, ie. rva-test.appspot.com.
                if (parts[parts.length - 2] === 'appspot') {
                  result = parts.slice(parts.length - 3).join('.');
                } else {
                  result = parts.slice(parts.length - 2).join('.');
                }
              } else {
                //localhost
                result = hostname;
              }
            }

            $log.debug('baseDomain', result);
          }
          return result;
        };

      }
    ]);

})(angular);
