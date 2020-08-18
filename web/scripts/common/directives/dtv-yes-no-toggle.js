'use strict';

angular.module('risevision.apps.directives')
  .directive('yesNoToggle', [
    function () {
      return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
          ngModel: '=',
          ngClick: '=',
          ngDisabled: '=',
          buttonId: '@'
        },
        templateUrl: 'partials/common/yes-no-toggle.html',
        link: function () {
          //
        }
      };
    }
  ]);
