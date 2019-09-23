angular.module("risevision.common.header")
  .controller("RegisterButtonCtrl", ["$scope", "$cookies", "uiFlowManager",
    function ($scope, $cookies, uiFlowManager) {

      $scope.register = function () {
        $cookies.remove("surpressRegistration");
        uiFlowManager.invalidateStatus("registrationComplete");
      };
    }
  ]);
