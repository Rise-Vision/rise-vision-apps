'use strict';

angular.module('risevision.widget.common.url-field.response-header-validator', [
    'risevision.widget.common.url-field.response-header-analyzer'
  ])
  .directive('responseHeaderValidator', ['responseHeaderAnalyzer', '$q',
    function (responseHeaderAnalyzer, $q) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          ngModelCtrl.$asyncValidators.responseHeaderValidator = function (modelValue, viewValue) {
            var value = modelValue || viewValue;
            //prevent requests if field is already invalid
            if (!value || (Object.keys(ngModelCtrl.$error).length >= 1 && !ngModelCtrl.$error
                .responseHeaderValidator)) {
              return $q.resolve();
            }
            return responseHeaderAnalyzer.validate(value);
          };
        }
      };
    }
  ]);
