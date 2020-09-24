'use strict';

angular.module('risevision.apps.directives')
  .directive('maderoCheckbox', [
    function () {
      return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        scope: {
          ngModel: '=',
          ngValue: '=',
          checkboxId: '@'
        },
        templateUrl: 'partials/common/madero-checkbox.html',
        link: function ($scope, element, attrs) {
          if (attrs.ngModel) {
            $scope.onClick = function() {
              $scope.ngModel = !$scope.ngModel;
            };
          }
        }
      };
    }
  ]);
