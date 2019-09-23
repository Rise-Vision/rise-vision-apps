"use strict";

angular.module("risevision.common.components.purchase-flow")
  .filter("countryName", ["COUNTRIES",
    function (COUNTRIES) {
      return function (countryCode) {
        var name = countryCode;
        for (var i = 0; i < COUNTRIES.length; i++) {
          if (COUNTRIES[i].code === countryCode) {
            name = COUNTRIES[i].name;

            break;
          }
        }
        return name;
      };
    }
  ]);
