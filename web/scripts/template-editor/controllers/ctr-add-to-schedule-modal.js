'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('AddToScheduleModalController', ['$scope', '$modalInstance', 'scheduleSelectorFactory', '$loading',
    function ($scope, $modalInstance, scheduleSelectorFactory, $loading) {
      $scope.factory = scheduleSelectorFactory;

      $scope.$watch('factory.loadingSchedules', function(isLoading) {
        if (isLoading) {
          $loading.start('add-to-schedule-spinner');
        } else {
          $loading.stop('add-to-schedule-spinner');
        }
      });

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
