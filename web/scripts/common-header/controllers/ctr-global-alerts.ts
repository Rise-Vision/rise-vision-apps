'use strict';

angular.module('risevision.common.header')
  .controller('GlobalAlertsCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

      $scope.errors = [];

      $scope.$on('risevision.user.authorized', function () {
        $scope.errors.length = 0;
      });

      $rootScope.$on('risevision.common.globalError', function (event, message) {
        $scope.errors.push(message);
      });

      $scope.dismiss = function (messageType, index) {
        $scope[messageType].splice(index, 1);
      };
    }
  ]);
