'use strict';

angular.module('risevision.storage.controllers')
  .controller('BreakLinkWarningModalCtrl', ['$scope', '$modalInstance', '$rootScope', '$translate',
    function ($scope, $modalInstance, $rootScope, $translate) {
      $scope.ok = function () {
        $modalInstance.close();
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
