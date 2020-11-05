'use strict';

angular.module('risevision.common.header.directives')
  .directive('emailValidator', ['EMAIL_REGEX',
    function (EMAIL_REGEX) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {
          var validator = function (value) {
            if (!value || EMAIL_REGEX.test(value)) {
              ngModel.$setValidity('rv-email', true);
            } else {
              ngModel.$setValidity('rv-email', false);
            }

            return value;
          };

          ngModel.$parsers.unshift(validator);
          ngModel.$formatters.unshift(validator);
        }
      };
    }
  ]);
