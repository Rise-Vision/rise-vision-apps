'use strict';

angular.module('risevision.storage.controllers')
  .controller('BreakLinkWarningModalCtrl', ['$scope', '$modalInstance',
    'localStorageService', 'infoLine1Key', 'infoLine2Key', 'localStorageKey',
    function ($scope, $modalInstance, localStorageService, infoLine1Key,
      infoLine2Key, localStorageKey) {
      $scope.infoLine1Key = infoLine1Key;
      $scope.infoLine2Key = infoLine2Key;

      $scope.hideWarning = false;

      $scope.ok = function () {
        localStorageService.set(localStorageKey, $scope.hideWarning);
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]);
