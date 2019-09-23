"use strict";

angular.module("risevision.common.components.subscription-status.filters")
  .filter("productTrialDaysToExpiry", ["$interpolate", "$translate",
    function ($interpolate, $translate) {
      var expiresToday = null;
      var expiresIn = null;

      $translate(["subscription-status.expires-today",
        "subscription-status.expires-in"
      ], {
        days: "{{days}}"
      }).then(function (values) {
        expiresToday = $interpolate(values[
          "subscription-status.expires-today"]);
        expiresIn = $interpolate(values["subscription-status.expires-in"]);
      });

      return function (subscriptionExpiry) {
        var msg = "";
        try {
          var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          var timeInMs = new Date(subscriptionExpiry).getTime() - new Date()
            .getTime();
          var days = Math.floor(timeInMs / oneDay);
          var params = {
            days: days
          };

          if (days === 0) {
            msg = expiresToday !== null ? expiresToday(params) : "";
          } else if (days > 0) {
            msg = expiresIn !== null ? expiresIn(params) : "";
          } else {
            msg = expiresToday !== null ? expiresToday(params) : "";
          }
        } catch (e) {
          // Nothing to do
        }

        return msg;
      };
    }
  ]);
