"use strict";

angular.module("risevision.common.components.userstate")
  .controller("ConfirmAccountCtrl", ["$scope", "$loading", "$log", "$state",
    "$stateParams", "userauth",
    function ($scope, $loading, $log, $state, $stateParams, userauth) {
      $loading.startGlobal("auth-confirm-account");

      userauth.confirmUserCreation($stateParams.user, $stateParams.token)
        .then(function () {
          $log.log("User confirmed");
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $loading.stopGlobal("auth-confirm-account");
          $state.go("common.auth.unauthorized", {
            accountConfirmed: true
          });
        });
    }
  ]);
