angular.module("risevision.common.header.directives")
  .directive("integerParser", [

    function () {
      return {
        require: "ngModel",
        link: function (scope, ele, attr, ctrl) {
          ctrl.$parsers.push(function (viewValue) {
            return parseInt(viewValue, 10) || 0;
          });
          ctrl.$formatters.push(function (viewValue) {
            return typeof viewValue === "undefined" ? "" : "" + viewValue;
          });
        }
      };
    }
  ]);
