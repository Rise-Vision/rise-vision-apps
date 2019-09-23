(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .directive("largerThanDate", [

      function () {
        return {
          require: "ngModel",
          link: function ($scope, $element, $attrs, ctrl) {
            $scope.$watchGroup(["timeline.startDate", "timeline.endDate"],
              function (newValues) {
                var startDate = newValues[0] && new Date(newValues[0]);
                var endDate = newValues[1] && new Date(newValues[1]);
                var validity = !(startDate && endDate && startDate >
                  endDate);

                ctrl.$setValidity("largerThanDate", validity);
              });
          }
        };
      }
    ]);
})(angular);
