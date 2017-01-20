'use strict';

angular.module('risevision.displays.services')
  .service('timeParser', [

    function () {

      var _addZero = function (i) {
        if (i < 10) {
          i = '0' + i;
        }
        return i;
      };

      var service = {
        getTime: function (date) {
          return _addZero(date.getHours()) + ':' + _addZero(date.getMinutes());
        },
        parseTime: function (time) {
          var d = new Date();
          var hours = 0,
            minutes = 0;

          if (time) {
            var tokens = time.split(':');

            if (tokens && tokens[0] && tokens[1]) {
              hours = parseInt(tokens[0]) || 0;
              minutes = parseInt(tokens[1]) || 0;
            }
          }

          d.setHours(hours);
          d.setMinutes(minutes);
          d.setSeconds(0);

          return d;
        }
      };

      return service;
    }
  ]);
