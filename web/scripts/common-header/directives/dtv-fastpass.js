angular.module("risevision.common.header.directives")
  .directive("fastpass", ["loadFastpass", "userState",
    function (loadFastpass, userState) {
      return {
        restrict: "AE",
        scope: {},
        link: function ($scope) {
          $scope.$watch(function () {
            return userState.getUserEmail();
          }, function (email) {
            if (email) {
              loadFastpass(userState.getUsername(), userState.getUserEmail());
            }
          });
        }
      };
    }
  ]);
