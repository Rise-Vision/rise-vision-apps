'use strict';

angular.module('risevision.storage.controllers')
  .controller('BreakLinkWarningModalCtrl', ['$scope', '$modalInstance', '$rootScope', '$translate', 'localStorageService',
    function ($scope, $modalInstance, $rootScope, $translate, localStorageService) {
      $scope.hideWarning = false;

      $scope.ok = function () {
        localStorageService.set('breakingLinkWarning.hideWarning', $scope.hideWarning);
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
