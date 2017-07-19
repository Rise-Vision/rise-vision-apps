'use strict';

angular.module('risevision.apps.directives')
  .directive('guidValidator', [
    function () {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {
          var GUID_REGEXP = /^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/i;

          var validator = function (value) {
            if (!value || GUID_REGEXP.test(value)) {
              ngModel.$setValidity('guid', true);
            } else {
              ngModel.$setValidity('guid', false);
            }

            return value;
          };

          ngModel.$parsers.unshift(validator);
          ngModel.$formatters.unshift(validator);
        }
      };
    }
  ]);
