'use strict';
angular.module('risevision.displays.controllers')
  .controller('BulkDeleteModalCtrl', ['$scope', '$modalInstance', 'userState', 'selectedItems', 
    function ($scope, $modalInstance, userState, selectedItems) {
      $scope.companyDisplays = 0;
      $scope.subCompanyDisplays = 0;
      $scope.inputText = null;
      $scope.expectedText = selectedItems.length.toString();

      angular.forEach(selectedItems, function(display) {
        if (display.companyId === userState.getSelectedCompanyId()) {
          $scope.companyDisplays++;
        } else {
          $scope.subCompanyDisplays++;
        }
      });

      $scope.delete = function () {
        if ($scope.inputText === $scope.expectedText) {
          $modalInstance.close();
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
