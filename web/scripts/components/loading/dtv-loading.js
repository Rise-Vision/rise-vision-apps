"use strict";

angular.module("risevision.common.components.loading")
  .directive("rvSpinner", ["usSpinnerService", "$compile",
    function (usSpinnerService, $compile) {
      return {
        scope: {
          backdropClass: "@rvSpinnerBackdropClass",
          rvSpinnerKey: "@rvSpinnerKey",
          rvSpinnerStartActive: "=?rvSpinnerStartActive",
          rvSpinnerOptions: "=rvSpinner"
        },
        link: function postLink(scope, $element, iAttrs) {
          scope.active = angular.isDefined(iAttrs.rvSpinnerStartActive) &&
            iAttrs.rvSpinnerStartActive === "1";
          var tpl =
            "<div ng-show=\"active\" class=\"spinner-backdrop fade {{backdropClass}}\"" +
            " ng-class=\"{in: active}\" us-spinner=\"rvSpinnerOptions\"" +
            " spinner-key=\"{{rvSpinnerKey}}\"";

          if (iAttrs.rvSpinnerStartActive && iAttrs.rvSpinnerStartActive ===
            "1") {
            tpl += " spinner-start-active=\"1\"></div>";
          } else {
            tpl += "></div>";
          }

          $element.prepend($compile(tpl)(scope));

          scope.$on("rv-spinner:start", function (event, key) {
            if (key === scope.rvSpinnerKey) {
              usSpinnerService.spin(key);
              scope.active = true;
            }
          });

          scope.$on("rv-spinner:stop", function (event, key) {
            if (key === scope.rvSpinnerKey) {
              usSpinnerService.stop(key);
              scope.active = false;
            }
          });
        }
      };
    }
  ]);
