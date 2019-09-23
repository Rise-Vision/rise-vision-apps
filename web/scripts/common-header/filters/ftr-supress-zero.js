"use strict";

angular.module("risevision.common.header.filters")
  .filter("surpressZero", function () {
    return function (num) {
      if (num) {
        return num;
      } else {
        return "";
      }
    };
  });
