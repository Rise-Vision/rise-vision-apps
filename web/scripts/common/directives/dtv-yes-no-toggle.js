'use strict';

angular.module('risevision.apps.directives')
  .directive('yesNoToggle', ['$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
          ngModel: '=',
          ngChange: '&',
          ngDisabled: '=',
          buttonId: '@'
        },
        templateUrl: 'partials/common/yes-no-toggle.html',
        link: function ($scope) {
          $scope.onChange = function() {
            // Wait for $digest so ngModel is updated before triggering ngChange
            $timeout($scope.ngChange);
          };
        }
      };
    }
  ]);
