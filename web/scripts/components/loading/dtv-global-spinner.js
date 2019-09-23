"use strict";

angular.module("risevision.common.components.loading")
  .directive("rvGlobalSpinner", ["usSpinnerService", "$compile",
    "_rvGlobalSpinnerRegistry",
    "$timeout", "$rootScope",
    function (usSpinnerService, $compile, _rvGlobalSpinnerRegistry, $timeout,
      $rootScope) {
      return {
        scope: true,
        link: function (scope, $element) {

          var tpl = "<div ng-show=\"active\" class=\"spinner-backdrop fade\"" +
            " ng-class=\"{in: active}\" us-spinner=\"rvSpinnerOptions\"" +
            " spinner-key=\"_rv-global-spinner\" ng-focus=\"spinnerFocused()\"></div>";
          $element.prepend($compile(tpl)(scope));

          scope.rvSpinnerOptions = {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: "#555", // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: "spinner", // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: "50%", // Top position relative to parent in px
            left: "50%" // Left position relative to parent in px
          };

          scope.registry = _rvGlobalSpinnerRegistry;

          scope.$watchCollection("registry", function () {
            if (scope.registry.length > 0) {
              scope.active = true;
            } else {
              scope.active = false;
            }
          });

          scope.$watch("active", function (active) {
            if (active) {
              $element.removeClass("ng-hide");
            } else {
              $element.addClass("ng-hide");
            }
          });

          //to be used if user has closed Google authentication popup dialog
          //without completing the registration process

          scope.spinnerFocused = function () {
            $rootScope.$broadcast("rv-spinner:global:focused");
          };

          $timeout(function () {
            usSpinnerService.spin("_rv-global-spinner");
          });
          scope.active = true;

        }
      };
    }
  ]);
