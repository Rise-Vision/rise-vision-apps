'use strict';

angular.module('risevision.displays.services')
  .service('timeParser', [

    function () {
      var regexAmpm = /^(\d{1,2}):(\d{1,2}) (\D{2})$/;
      var regexMilitary = /^(\d{1,2}):(\d{1,2})/;

      var _addZero = function (i) {
        if (i < 10) {
          i = '0' + i;
        }
        return i;
      };

      var service = {
        parseAmpm: function (timeString) {
          if (!regexAmpm.test(timeString)) {
            return null;
          }

          var parts = regexAmpm.exec(timeString);
          var hours = Number(parts[1]);
          var minutes = Number(parts[2]);
          var meridian = parts[3];

          hours = (meridian === 'PM') ? hours + 12 : hours;
          hours = (hours === 12 && meridian === 'AM') ? 0 : hours;

          return _addZero(hours) + ':' + _addZero(minutes);
        },
        parseMilitary: function (timeString) {
          if (!regexMilitary.test(timeString)) {
            return null;
          }

          var parts = regexMilitary.exec(timeString);

          var hours = Number(parts[1]);
          var minutes = Number(parts[2]);
          var ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;

          return _addZero(hours) + ':' + _addZero(minutes) + ' ' + ampm;
        }
      };

      return service;
    }
  ]);
