'use strict';

angular.module('risevision.apps.launcher.controllers')

  .controller("modalCtrl", [
    "$scope", "$modal",
    function ($scope, $modal) {

      // $scope.openLg = function () {
      //   $modal.open({
      //     templateUrl: "partials/displays/display-add-modal.html",
      //     size: "lg"
      //   });
      // };

      $scope.openConfigureDisplayControl = function () {
        $modal.open({
          templateUrl: "partials/displays/configure-control-modal.html",
          size: "md"
        });
      };

      $scope.openDisplayControlCTA = function () {
        $modal.open({
          templateUrl: "partials/displays/display-control-cta.html",
          size: "lg"
        });
      };

    }
  ]);
