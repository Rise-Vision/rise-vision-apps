'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAddModal', ['$scope', '$modalInstance', 'downloadOnly',
    function ($scope, $modalInstance, downloadOnly) {
      var _init = function() {
        if (downloadOnly) {
          $scope.setCurrentPage('displayAdded');
        }
      };

      $scope.setCurrentPage = function (tabName) {
        $scope.currentPage = tabName;
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      _init();

    }
  ]);
