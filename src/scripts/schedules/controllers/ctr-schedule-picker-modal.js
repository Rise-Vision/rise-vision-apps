'use strict';

angular.module('risevision.schedules.controllers')
  .controller('SchedulePickerModalController', ['$scope', '$modalInstance', 'scheduleSelectorFactory',
    function ($scope, $modalInstance, scheduleSelectorFactory) {
      $scope.factory = scheduleSelectorFactory;
      $scope.selectedSchedule = null;

      $scope.assign = function () {
        $modalInstance.close($scope.selectedSchedule);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
