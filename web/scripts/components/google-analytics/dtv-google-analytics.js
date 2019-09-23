/**
 * Created by rodrigopavezi on 11/28/14.
 */
(function (angular) {
  "use strict";
  angular.module("risevision.common.components.google-analytics", [])
    .directive("analytics", function () {
      return {
        restrict: "E",
        scope: {
          analyticsAccountId: "="
        },
        link: function () {
          /*jshint -W030 */
          /*jshint -W033 */
          (function (i, s, o, g, r, a, m) {
            i.GoogleAnalyticsObject = r;
            i[r] = i[r] || function () {
              (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
          })(window, document, "script",
            "//www.google-analytics.com/analytics.js", "ga");
          /*jshint +W030 */
          /*jshint +W033 */
        },
        controller: ["$scope", "$window",
          function ($scope, $window) {
            $scope.$watch("analyticsAccountId", function (newId) {
              if (newId) {
                $window.ga("create", $scope.analyticsAccountId, "auto");
              }
            });
          }
        ]
      };
    });
})(angular);
