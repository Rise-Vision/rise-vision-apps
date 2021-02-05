'use strict';

angular.module('risevision.common.header.directives')
  .directive('commonHeaderHeight', ['$window', '$timeout',
    function ($window, $timeout) {
      return {
        restrict: 'A',
        scope: true,
        link: function ($scope, elem) {
          var _updateHeight = function () {
            // Wait for the digest cycle to finish updating the UI
            $timeout(function () {
              var commonHeaderDiv = $window.document.getElementById('commonHeaderDiv');
              var elemStyle = $window.getComputedStyle(commonHeaderDiv);
              var currentHeightPx = elemStyle.getPropertyValue('height');
              var currentHeight = parseInt(currentHeightPx);

              elem[0].style.setProperty('--common-header-height', currentHeight + 'px');
            });
          };

          _updateHeight();

          $scope.$on('risevision.company.selectedCompanyChanged', _updateHeight);
          // Should take care of plan & company settings updates
          $scope.$on('risevision.company.updated', _updateHeight);
        } //link()
      };
    }
  ]);
