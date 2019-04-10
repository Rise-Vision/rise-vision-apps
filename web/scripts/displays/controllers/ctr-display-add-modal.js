'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAddModal', ['$scope', '$modalInstance', 'downloadOnly',
    function ($scope, $modalInstance, downloadOnly) {
      var _init = function() {
        if (downloadOnly) {
          $scope.setCurrentTab('displayAdded');
        }
      };

      $scope.setCurrentTab = function (tabName) {
        $scope.currentTab = tabName;
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      _init();

    }
  ]);
