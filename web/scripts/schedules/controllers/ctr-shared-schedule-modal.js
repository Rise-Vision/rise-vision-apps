'use strict';

angular.module('risevision.schedules.controllers')
  .controller('SharedScheduleModalController', ['$scope', '$modalInstance', 'scheduleFactory',
    function ($scope, $modalInstance, scheduleFactory) {
      $scope.schedule = scheduleFactory.schedule;
      $scope.currentTab = 'link';

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]); //ctr
