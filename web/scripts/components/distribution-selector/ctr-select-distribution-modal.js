'use strict';

angular.module('risevision.common.components.distribution-selector')
  .controller('selectDistributionModal', ['$scope', '$rootScope', '$modalInstance',
    'distribution',
    function ($scope, $rootScope, $modalInstance, distribution) {
      $scope.parameters = {};

      $scope.parameters.distribution = (distribution) ? angular.copy(
        distribution) : [];

      $scope.apply = function () {
        console.debug('Selected Distribution: ', $scope.parameters.distribution);
        $modalInstance.close($scope.parameters.distribution);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
