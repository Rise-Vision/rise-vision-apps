'use strict';

angular.module('risevision.widget.common.url-field.response-header-validator',[
  'risevision.widget.common.url-field.response-header-analyzer'
  ])
  .directive('responseHeaderValidator', ['responseHeaderAnalyzer', '$q',
    function (responseHeaderAnalyzer, $q) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          ngModelCtrl.$asyncValidators.responseHeaderValidator = function (modelValue, viewValue) {
            //prevent requests if field is already invalid
            if (Object.keys(ngModelCtrl.$error).length >= 1 && !ngModelCtrl.$error.responseHeaderValidator) {
              return $q.resolve();
            }
            var value = modelValue || viewValue;
            return responseHeaderAnalyzer.validate(value);
          };
        }
      };
    }
  ]);
