"use strict";

angular.module("risevision.common.components.userstate")
  .controller("RequestConfirmationEmailCtrl", ["$scope", "$loading", "$log",
    "userauth",
    function ($scope, $loading, $log, userauth) {
      $scope.forms = {};
      $scope.credentials = {};
      $scope.emailSent = false;
      $scope.isGoogleAccount = false;
      $scope.emailAlreadyConfirmed = false;

      $scope.requestConfirmationEmail = function () {
        $scope.emailSent = false;
        $scope.isGoogleAccount = false;
        $scope.emailAlreadyConfirmed = false;
        $loading.startGlobal("auth-request-confirmation-email");

        userauth.requestConfirmationEmail($scope.credentials.username)
          .then(function () {
            $log.log("Confirmation email request sent");
            $scope.emailSent = true;
          })
          .catch(function (err) {
            if (err.status === 400) {
              $log.log("Requested confirmation email for Google account");
              $scope.isGoogleAccount = true;
            } else if (err.status === 409) {
              $log.log(
                "Requested confirmation email for already confirmed account"
              );
              $scope.emailAlreadyConfirmed = true;
            } else { // No special case for 404, for security reasons
              console.error(err);
              $scope.emailSent = true;
            }
          })
          .finally(function () {
            $loading.stopGlobal("auth-request-confirmation-email");
          });
      };
    }
  ]);
