'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAdd', ['$scope', '$log', '$loading', 'displayFactory', 'playerLicenseFactory',
    function ($scope, $log, $loading, displayFactory, playerLicenseFactory) {
      $scope.factory = displayFactory;
      $scope.playerLicenseFactory = playerLicenseFactory;
      $scope.selectedSchedule = null;

      $scope.$watch('factory.loadingDisplay', function (loading) {
        if (loading) {
          $loading.start('display-loader');
        } else {
          $loading.stop('display-loader');
        }
      });

      $scope.save = function () {
        if (!$scope.displayDetails.$valid) {
          $log.info('form not valid: ', $scope.displayDetails.errors);
          return;
        }

        displayFactory.addDisplay($scope.selectedSchedule);
      };

    }
  ]);
