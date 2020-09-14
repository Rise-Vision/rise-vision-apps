'use strict';

angular.module('risevision.widget.common.url-field.http-validator', [
    'risevision.widget.common.url-field.insecure-url'
  ])
  .directive('httpValidator', ['insecureUrl',
    function (insecureUrl) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          ngModelCtrl.warnings = ngModelCtrl.warnings || {};
          var validator = function (value) {
            if (insecureUrl(value)) {
              ngModelCtrl.warnings.httpUrl = true;
            } else {
              ngModelCtrl.warnings.httpUrl = false;
            }

            return value;
          };
          ngModelCtrl.$parsers.unshift(validator);
          ngModelCtrl.$formatters.unshift(validator);
        }
      };
    }
  ]);
