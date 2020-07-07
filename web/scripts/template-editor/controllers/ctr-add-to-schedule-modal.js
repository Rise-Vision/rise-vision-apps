'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('AddToScheduleModalController', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
