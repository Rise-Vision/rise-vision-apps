'use strict';

angular.module('risevision.editor.controllers')

.controller("UxCtrl", [
  "$scope", "$modal",
  function ($scope, $modal) {

    $scope.open = function () {
      $modal.open({
        templateUrl: "partials/ux-modal.html",
        size: "md"
      });
    };

    $scope.open2 = function () {
      $modal.open({
        templateUrl: "partials/ux-modal2.html",
        size: "md"
      });
    };

  }
]);
