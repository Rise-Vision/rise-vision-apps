"use strict";

angular.module("risevision.common.header.directives")
  .constant("CLASSIC_EDITOR_URL", "https://rva.risevision.com/#PRESENTATIONS")
  .directive("classicEditorLink", ["$window", "userState", "CLASSIC_EDITOR_URL",
    function ($window, userState, CLASSIC_EDITOR_URL) {
      return {
        restrict: "A",
        scope: false,
        compile: function (elem) {
          elem.bind("click", function () {
            var companyId = userState.getSelectedCompanyId();
            var url = CLASSIC_EDITOR_URL + (companyId ? "?cid=" + companyId : "");

            $window.open(url, "_blank");

          });

        } //link()
      };
    }
  ]);
