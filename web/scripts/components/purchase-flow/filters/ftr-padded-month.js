"use strict";

angular.module("risevision.common.components.purchase-flow")
  .filter("paddedMonth", [

    function () {
      return function (month) {
        if (month < 10) {
          month = "0" + month;
        }

        return month;
      };
    }
  ]);
