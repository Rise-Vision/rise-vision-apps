'use strict';

angular.module('risevision.widget.common.url-field.http-validator', [])
  .directive('httpValidator', [
    function () {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          var validator = function (value) {
            if (value && value.startsWith('http://')) {
              ngModelCtrl.$setValidity('httpUrl', false);
            } else {
              ngModelCtrl.$setValidity('httpUrl', true);
            }

            return value;
          };
          ngModelCtrl.$parsers.unshift(validator);
          ngModelCtrl.$formatters.unshift(validator);
        }
      };
    }
  ]);
