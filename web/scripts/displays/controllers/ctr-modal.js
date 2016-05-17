'use strict';

angular.module('risevision.displays.controllers')

.controller("modalCtrl", [
  "$scope", "$modal",
  function ($scope, $modal) {

    $scope.open = function () {
      $modal.open({
        templateUrl: "partials/displays/template-modal.html",
        size: "lg"
      });
    };

    $scope.openShared = function () {
      $modal.open({
        templateUrl: "partials/displays/template-modal.html",
        size: "md"
      });
    };

  }
]);
