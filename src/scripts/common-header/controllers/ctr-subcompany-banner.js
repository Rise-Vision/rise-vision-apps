'use strict';

angular.module('risevision.common.header')
  .controller('SubcompanyBannerCtrl', ['$scope', '$modal',
    '$loading', 'userState',
    function ($scope, $modal, $loading, userState) {
      $scope.inRVAFrame = userState.inRVAFrame();

      $scope.$watch(function () {
          return userState.getSelectedCompanyId();
        },
        function () {
          $scope.isSubcompanySelected = userState.isSubcompanySelected();
          $scope.selectedCompanyName = userState.getSelectedCompanyName();
        });

      $scope.switchToMyCompany = function () {
        userState.resetCompany();
      };
    }
  ]);
