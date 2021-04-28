'use strict';

angular.module('risevision.common.header')
  .controller('SafeDeleteModalCtrl', ['$scope', '$modalInstance', 'name',
    function ($scope, $modalInstance, name) {
      $scope.name = name;
      $scope.inputText = null;
      $scope.canConfirm = false;

      $scope.$watch('inputText', function () {
        $scope.canConfirm = $scope.inputText === 'DELETE';
      });

      $scope.confirm = function () {
        if ($scope.canConfirm) {
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
