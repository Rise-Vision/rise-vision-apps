angular.module("risevision.common.header")

.controller("AddUserModalCtrl", ["$scope", "$filter", "addUser",
  "$modalInstance", "companyId", "userState", "userRoleMap",
  "humanReadableError", "messageBox", "$loading", "segmentAnalytics",
  "COMPANY_ROLE_FIELDS",
  function ($scope, $filter, addUser, $modalInstance, companyId,
    userState, userRoleMap, humanReadableError, messageBox, $loading,
    segmentAnalytics, COMPANY_ROLE_FIELDS) {
    $scope.isAdd = true;
    $scope.COMPANY_ROLE_FIELDS = COMPANY_ROLE_FIELDS;
    $scope.isUserAdmin = userState.isUserAdmin();

    //push roles into array
    $scope.availableRoles = [];
    angular.forEach(userRoleMap, function (v, k) {
      $scope.availableRoles.push({
        key: k,
        name: v
      });
    });

    //convert string to numbers
    $scope.$watch("user.status", function (status) {
      if ($scope.user && typeof $scope.user.status === "string") {
        $scope.user.status = parseInt(status);
      }
    });

    $scope.$watch("loading", function (loading) {
      if (loading) {
        $loading.start("user-settings-modal");
      } else {
        $loading.stop("user-settings-modal");
      }
    });

    $scope.save = function () {
      if (!$scope.forms.userSettingsForm.$invalid) {
        $scope.loading = true;
        addUser(companyId, $scope.user.username, $scope.user)
          .then(function () {
              segmentAnalytics.track("User Created", {
                userId: $scope.user.username,
                companyId: companyId
              });

              $modalInstance.close("success");
            },
            function (error) {

              var errorMessage = "Error: " + humanReadableError(error);
              if (error.code === 409) {
                errorMessage = $filter("translate")(
                  "common-header.user.error.duplicate-user", {
                    "username": $scope.user.username
                  });
              }

              messageBox("common-header.user.error.add-user", errorMessage);
            })
          .finally(function () {
            $scope.loading = false;
          });
      }
    };

    $scope.closeModal = function () {
      $modalInstance.dismiss("cancel");
    };

    $scope.editRoleAllowed = function (role) {
      if (userState.isRiseAdmin()) {
        return true;
      } else if (userState.isUserAdmin()) {
        if (role.key === "sa" || role.key === "ba") {
          return false;
        } else {
          return true;
        }
      } else {
        //do not allow user to check/uncheck role by default
        return false;
      }
    };

    $scope.editRoleVisible = function (role) {
      if (userState.isSelectedCompanyChargebee() && role.key === "pu") {
        return false;
      } else if (userState.isRiseAdmin()) {
        if (userState.isSubcompanySelected() && (role.key === "sa" || role.key ===
          "ba")) {
          return false;
        } else {
          return true;
        }
      } else if (userState.isUserAdmin() || userState.isRiseVisionUser()) {
        if (role.key === "sa" || role.key === "ba") {
          return false;
        } else {
          return true;
        }
      } else {
        // in practice should never reach here
        return false;
      }
    };

    $scope.forms = {};

  }
]);
