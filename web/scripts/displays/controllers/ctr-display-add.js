'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAdd', ['$scope', 'displayFactory', '$loading',
    function ($scope, displayFactory, $loading) {
      $scope.factory = displayFactory;
      $scope.display = displayFactory.display;

      $scope.$watch('factory.loadingDisplay', function (loading) {
        if (loading) {
          $loading.start('display-loader');
        } else {
          $loading.stop('display-loader');
        }
      });

      $scope.save = function () {
        if (!$scope.displayDetails.$valid) {
          console.error('form not valid: ', $scope.displayDetails.errors);
          return;
        }

        displayFactory.addDisplay();
      };

    }
  ]);
