"use strict";

angular.module("risevision.common.components.focus-me", [])
  .directive("focusMe", ["$timeout",
    function ($timeout) {
      return {
        scope: {
          trigger: "=focusMe"
        },
        link: function (scope, element) {
          scope.$watch("trigger", function (trigger) {
            if (trigger) {
              $timeout(function () {
                element[0].focus();
              });
            }
          });
        }
      };
    }
  ]);
