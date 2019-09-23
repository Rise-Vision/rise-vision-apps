"use strict";

angular.module("risevision.common.components.stop-event", [])
  .directive("stopEvent", function () {
    return {
      restrict: "A",
      link: function (scope, element, attr) {
        element.on(attr.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  });
