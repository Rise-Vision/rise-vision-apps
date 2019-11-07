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
  ])



.directive('zxcvbnValidator', ['$ocLazyLoad', '$q',
    function ($ocLazyLoad, $q) {
      return {
        require: 'ngModel',
        scope: {
          zxcvbnValidator: '='
        },
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          ngModelCtrl.$asyncValidators.zxcvbnValidator = function (modelValue, viewValue) {
            console.log('validating')
            var value = modelValue || viewValue;
            return $ocLazyLoad.load('vendor/zxcvbn/zxcvbn.js').then(function() {
              var result = zxcvbn(value);
              console.log('validating res', result);
              scope.zxcvbnValidator = result;
              return result.score >=2;
            });
          };
        }
      };
    }
  ])


  ;
