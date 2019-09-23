"use strict";

angular.module("risevision.common.components.timeline.services")
  .factory("timelineDescription", ["$filter",
    function ($filter) {
      var service = {};

      var RECURRENCE = {
        DAILY: "Daily",
        WEEKLY: "Weekly",
        MONTHLY: "Monthly",
        YEARLY: "Yearly"
      };

      var LABEL = {
        EVERY_DAY: "Every Day",
        ALL_DAY: "All Day",
        START: "Start",
        END: "End",
        TO: "to",
        DAY: "Day",
        OF: "Of",
        EVERY: "Every"
      };

      var OPTIONS_WEEK = ["First", "Second", "Third", "Fourth",
        "Last"
      ];

      var OPTIONS_DAY_OF_THE_WEEK = ["Sunday", "Monday", "Tuesday",
        "Wednesday", "Thursday", "Friday", "Saturday"
      ];

      var OPTIONS_MONTH = ["January", "February", "March", "April", "May",
        "June",
        "July", "August", "September", "October", "November",
        "December"
      ];

      var _filterDateFormat = function (date, useLocaldate, format) {
        var formattedDate = "";
        var dateObject = new Date(date);
        if (useLocaldate) {
          dateObject.setMinutes(dateObject.getMinutes() + dateObject.getTimezoneOffset());
          formattedDate = $filter("date")(dateObject, format);
        } else {
          formattedDate = $filter("date")(dateObject, format);
        }

        return formattedDate;
      };

      service.updateLabel = function (timeline) {
        var label = "";

        var shortFormat = "dd-MMM-yyyy";

        if (timeline.startDate) {
          label = label + _filterDateFormat(timeline.startDate,
            timeline.useLocaldate,
            shortFormat) + " ";
        }

        if (timeline.endDate) {
          label = label + LABEL.TO + " " + _filterDateFormat(
            timeline.endDate, timeline.useLocaldate,
            shortFormat) + " ";
        }

        if (timeline.startTime) {
          var shortTimeformat = "hh:mm a";
          label = label + _filterDateFormat(timeline.startTime,
            timeline.useLocaldate,
            shortTimeformat) +
            " ";

          if (timeline.endTime) {
            label = label + LABEL.TO + " " + _filterDateFormat(
              timeline
              .endTime, timeline.useLocaldate,
              shortTimeformat) + " ";
          }
        }
        if (timeline.recurrenceType) {
          var monthFrequency = 0;
          label = label + timeline.recurrenceType + " ";

          if (timeline.recurrenceType === RECURRENCE.MONTHLY) {
            if (timeline.recurrenceAbsolute) {
              label = label + LABEL.DAY + " " + timeline.recurrenceDayOfMonth +
                " " + LABEL.OF + " ";
              monthFrequency = timeline.recurrenceFrequency;
            } else {
              label = label + OPTIONS_WEEK[timeline.recurrenceWeekOfMonth] +
                " " + OPTIONS_DAY_OF_THE_WEEK[timeline.recurrenceDayOfWeek] +
                " " + LABEL.OF + " ";
              monthFrequency = timeline.recurrenceFrequency;
            }
          }


          label = label + LABEL.EVERY + " ";


          if (timeline.recurrenceType === RECURRENCE.YEARLY) {
            if (timeline.recurrenceAbsolute) {
              label = label + OPTIONS_MONTH[timeline.recurrenceMonthOfYear] +
                " " + timeline.recurrenceDayOfMonth +
                " ";
            } else {
              label = label + OPTIONS_WEEK[timeline.recurrenceWeekOfMonth] +
                " " + OPTIONS_DAY_OF_THE_WEEK[timeline.recurrenceDayOfWeek] +
                " " + LABEL.OF + " " + OPTIONS_MONTH[timeline.recurrenceMonthOfYear] +
                " ";
            }
          } else {

            label = label + timeline.recurrenceFrequency +
              " " +
              timeline.recurrenceType
              .substring(0, timeline.recurrenceType.length -
                2).replace(
                "i", "y") + "(s)" + " ";

          }

          if (timeline.recurrenceType === RECURRENCE.WEEKLY && timeline
            .recurrenceDaysOfWeek) {

            for (var i = 0; i < timeline.recurrenceDaysOfWeek.length; i++) {
              if (timeline.recurrenceDaysOfWeek[i] === "Mon") {
                label = label + OPTIONS_DAY_OF_THE_WEEK[1] + " ";
              } else if (timeline.recurrenceDaysOfWeek[i] === "Tue") {
                label = label + OPTIONS_DAY_OF_THE_WEEK[2] + " ";
              } else if (timeline.recurrenceDaysOfWeek[i] === "Wed") {
                label = label + OPTIONS_DAY_OF_THE_WEEK[3] + " ";
              } else if (timeline.recurrenceDaysOfWeek[i] === "Thu") {
                label = label + OPTIONS_DAY_OF_THE_WEEK[4] + " ";
              } else if (timeline.recurrenceDaysOfWeek[i] === "Fri") {
                label = label + OPTIONS_DAY_OF_THE_WEEK[5] + " ";
              } else if (timeline.recurrenceDaysOfWeek[i] === "Sat") {
                label = label + OPTIONS_DAY_OF_THE_WEEK[6] + " ";
              } else if (timeline.recurrenceDaysOfWeek[i] === "Sun") {
                label = label + OPTIONS_DAY_OF_THE_WEEK[0] + " ";
              }
            }
          }
        }
        return label;

      };

      return service;
    }
  ]);
