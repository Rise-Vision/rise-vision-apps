'use strict';

angular.module('risevision.widget.common.url-field.http-validator', [])
  .directive('httpValidator', [
    function () {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          ngModelCtrl.warnings = ngModelCtrl.warnings || {};
          var validator = function (value) {
            if (value && value.startsWith('http://')) {
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
