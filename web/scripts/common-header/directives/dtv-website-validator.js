"use strict";

angular.module("risevision.common.header.directives")
  .directive("websiteValidator", [

    function () {
      return {
        require: "ngModel",
        restrict: "A",
        link: function (scope, elem, attr, ngModel) {
          var WEBSITE_REGEXP =
            /^(http[s]?:\/\/){0,1}([^\s/?\.#:@"]+\.)+([^\s/?\.#:"@-]{2,61})([\/?#][^\s"]*)?$/;

          var validator = function (value) {
            if (!value || WEBSITE_REGEXP.test(value)) {
              ngModel.$setValidity("website", true);
            } else {
              ngModel.$setValidity("website", false);
            }

            return value;
          };

          ngModel.$parsers.unshift(validator);
          ngModel.$formatters.unshift(validator);
        }
      };
    }
  ]);
