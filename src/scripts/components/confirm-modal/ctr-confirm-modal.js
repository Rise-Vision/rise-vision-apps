'use strict';

angular.module('risevision.common.components.confirm-modal', [
    'risevision.common.components.confirm-modal.services'
  ])
  .controller('confirmModalController', ['$scope', '$modalInstance',
    'confirmationTitle', 'confirmationMessage', 'confirmationButton',
    'cancelButton',
    function ($scope, $modalInstance, confirmationTitle, confirmationMessage,
      confirmationButton, cancelButton) {
      $scope.confirmationTitle = confirmationTitle;
      $scope.confirmationMessage = confirmationMessage;
      $scope.confirmationButton = confirmationButton ? confirmationButton :
        'common.ok';
      $scope.cancelButton = cancelButton ? cancelButton : 'common.cancel';

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
