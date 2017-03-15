'use strict';

angular.module('risevision.storage.controllers')
  .controller('BreakLinkWarningModalCtrl', ['$scope', '$modalInstance', 'localStorageService',
                                            'infoLine1Key', 'infoLine2Key', 'warningKey', 'confirmKey', 'cancelKey', 'localStorageKey',
    function ($scope, $modalInstance, localStorageService, infoLine1Key, infoLine2Key, warningKey, confirmKey, cancelKey, localStorageKey) {
      $scope.infoLine1Key = infoLine1Key;
      $scope.infoLine2Key = infoLine2Key;
      $scope.warningKey = warningKey;
      $scope.confirmKey = confirmKey ? confirmKey : 'common.ok';
      $scope.cancelKey = cancelKey ? cancelKey : 'common.cancel';

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
