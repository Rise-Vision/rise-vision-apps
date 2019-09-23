"use strict";

angular.module("risevision.common.components.userstate")
  .directive("confirmPasswordValidator", [

    function () {
      return {
        require: "ngModel",
        restrict: "A",
        scope: {
          confirmPasswordValidator: "="
        },
        link: function (scope, elem, attr, ngModel) {
          var validator = function (value) {
            if (!value || !scope.confirmPasswordValidator ||
              value === scope.confirmPasswordValidator) {
              ngModel.$setValidity("passwordMatch", true);
            } else {
              ngModel.$setValidity("passwordMatch", false);
            }

            return value;
          };

          ngModel.$parsers.unshift(validator);
          ngModel.$formatters.unshift(validator);
        }
      };
    }
  ]);
