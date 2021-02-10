'use strict';

angular.module('risevision.common.components.timeline-basic.services')
  .factory('timelineBasicDescription', ['$filter',
    function ($filter) {
      var service = {};

      var OPTIONS_DAY_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ];

      var _filterDateFormat = function (date, useLocaldate, format) {
        var formattedDate = '';
        var dateObject = new Date(date);
        if (useLocaldate) {
          dateObject.setMinutes(dateObject.getMinutes() + dateObject.getTimezoneOffset());
          formattedDate = $filter('date')(dateObject, format);
        } else {
          formattedDate = $filter('date')(dateObject, format);
        }

        return formattedDate;
      };

      service.updateLabel = function (tl) {
        var label = '';
        var weekDays = [];

        if (tl.allDay) {
          label = 'All day ';
        } else {
          if (tl.startTime) {
            var shortTimeformat = 'hh:mm a';
            label = label + _filterDateFormat(tl.startTime, tl.useLocaldate, shortTimeformat) + ' UTC ';

            if (tl.endTime) {
              label = label + 'to ' + _filterDateFormat(tl.endTime, tl.useLocaldate, shortTimeformat) + ' UTC ';
            }
          }
        }

        if (tl.recurrenceDaysOfWeek) {
          for (var i = 0; i < tl.recurrenceDaysOfWeek.length; i++) {
            if (tl.recurrenceDaysOfWeek[i] === 'Mon') {
              weekDays.push(OPTIONS_DAY_OF_THE_WEEK[1]);
            } else if (tl.recurrenceDaysOfWeek[i] === 'Tue') {
              weekDays.push(OPTIONS_DAY_OF_THE_WEEK[2]);
            } else if (tl.recurrenceDaysOfWeek[i] === 'Wed') {
              weekDays.push(OPTIONS_DAY_OF_THE_WEEK[3]);
            } else if (tl.recurrenceDaysOfWeek[i] === 'Thu') {
              weekDays.push(OPTIONS_DAY_OF_THE_WEEK[4]);
            } else if (tl.recurrenceDaysOfWeek[i] === 'Fri') {
              weekDays.push(OPTIONS_DAY_OF_THE_WEEK[5]);
            } else if (tl.recurrenceDaysOfWeek[i] === 'Sat') {
              weekDays.push(OPTIONS_DAY_OF_THE_WEEK[6]);
            } else if (tl.recurrenceDaysOfWeek[i] === 'Sun') {
              weekDays.push(OPTIONS_DAY_OF_THE_WEEK[0]);
            }
          }
        }

        if (tl.everyDay || weekDays.length === 0 || weekDays.length === 7) {
          label = label + 'every day';
        } else if (weekDays.length > 0) {
          label = label + 'every ' + weekDays.join(' ');
        }

        return label;
      };

      return service;
    }
  ]);
