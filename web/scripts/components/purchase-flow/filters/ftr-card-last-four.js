"use strict";

angular.module("risevision.common.components.purchase-flow")
  .filter("cardLastFour", [

    function () {
      return function (last4) {
        last4 = last4 ? last4 : "****";
        last4 = last4.length < 4 ? ("****".substr(last4.length) + last4) : last4;
        last4 = last4.length > 4 ? last4.substr(last4.length - 4) : last4;

        return "***-" + last4;
      };
    }
  ]);
