(function () {
  'use strict';

  angular.module('risevision.common.components.position-setting', ['risevision.common.i18n'])
    .directive('positionSetting', [function () {
      return {
        restrict: 'E',
        scope: {
          position: '=',
          hideLabel: '@',
          parentContainerClass: '=',
          containerClass: '='
        },
        templateUrl: 'partials/components/position-setting/position-setting.html',
        link: function ($scope) {
          $scope.$watch('position', function (position) {
            if (typeof position === 'undefined') {
              // set a default
              $scope.position = 'top-left';
            }
          });
        }
      };
    }]);
}());
