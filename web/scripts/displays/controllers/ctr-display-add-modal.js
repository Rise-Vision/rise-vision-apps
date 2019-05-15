'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAddModal', ['$scope', '$modalInstance', 'displayFactory', 'downloadOnly',
    function ($scope, $modalInstance, displayFactory, downloadOnly) {
      var _init = function () {
        $scope.display = displayFactory.display;
        $scope.downloadOnly = downloadOnly;

        if (downloadOnly) {
          $scope.setCurrentPage('displayAdded');
        }
      };

      $scope.$on('displayCreated', function () {
        $scope.display = displayFactory.display;
      });

      $scope.setCurrentPage = function (tabName) {
        $scope.previousPage = $scope.currentPage;
        $scope.currentPage = tabName;
      };

      $scope.showPreviousPage = function () {
        $scope.setCurrentPage($scope.previousPage);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      _init();

    }
  ]);
