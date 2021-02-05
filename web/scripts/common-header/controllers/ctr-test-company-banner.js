'use strict';

angular.module('risevision.common.header')
  .controller('TestCompanyBannerCtrl', ['$scope', 'userState',
    function ($scope, userState) {
      $scope.$watch(function () {
          return userState.isTestCompanySelected();
        },
        function (isTest) {
          $scope.isTestCompanySelected = isTest;
        });
    }
  ]);
