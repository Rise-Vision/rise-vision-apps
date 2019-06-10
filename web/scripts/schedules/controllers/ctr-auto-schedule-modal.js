'use strict';

angular.module('risevision.schedules.controllers')
  .controller('AutoScheduleModalController', ['$scope', '$modalInstance',
  'presentationName', 'displayFactory',
    function ($scope, $modalInstance, presentationName, displayFactory) {
      $scope.presentationName = presentationName;
      $scope.displayFactory = displayFactory;

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]); //ctr
