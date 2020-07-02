'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('AddToScheduleModalController', ['$scope', '$modalInstance', 'templateEditorFactory',
    function ($scope, $modalInstance, templateEditorFactory) {
      $scope.factory = templateEditorFactory;

      $scope.onScheduleSelected = function(scheduleIds) {
        templateEditorFactory.assignToSchedules(scheduleIds);
      };

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
