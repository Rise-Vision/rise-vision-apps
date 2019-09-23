"use strict";

angular.module("risevision.common.header.directives")
  .directive("requireRole", ["userState",
    function (userState) {
      return {
        restrict: "A",
        priority: 100000,
        scope: false,

        compile: function (element, attr) {
          var accessDenied = true;
          var requiredRoles = attr.requireRole.split(" ");
          for (var i in requiredRoles) {
            if (userState.hasRole(requiredRoles[i])) {
              accessDenied = false;
            }
          }
          if (accessDenied) {
            angular.forEach(element.children(), function (elm) {
              try {
                elm.remove();
              } catch (ignore) {}
            });
            element.remove();
          }
        }
      };
    }
  ]);
