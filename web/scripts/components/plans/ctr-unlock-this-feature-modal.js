'use strict';

angular.module('risevision.common.components.plans')
  .controller('UnlockThisFeatureModalCtrl', [
    '$scope', '$modalInstance', 'plansFactory',
    function ($scope, $modalInstance, plansFactory) {

      $scope.subscribe = function () {
        plansFactory.showPlansModal();
        $modalInstance.dismiss();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
