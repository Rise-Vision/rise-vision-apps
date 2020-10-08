'use strict';
angular.module('risevision.common.components.scrolling-list')
  .controller('BulkDeleteModalCtrl', ['$scope', '$modalInstance', 'userState', 'selectedItems', 'itemName',
    function ($scope, $modalInstance, userState, selectedItems, itemName) {
      $scope.itemName = itemName;
      $scope.companyItems = 0;
      $scope.subCompanyItems = 0;
      $scope.inputText = null;
      $scope.expectedText = selectedItems.length.toString();

      angular.forEach(selectedItems, function(display) {
        if (display.companyId === userState.getSelectedCompanyId()) {
          $scope.companyItems++;
        } else {
          $scope.subCompanyItems++;
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
