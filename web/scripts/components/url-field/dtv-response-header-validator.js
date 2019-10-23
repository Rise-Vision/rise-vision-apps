'use strict';

angular.module('risevision.widget.common.url-field')
.directive('responseHeaderValidator', ['responseHeaderAnalyzer', '$q',
    function (responseHeaderAnalyzer, $q) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          var _isInArray = function(key) {
            return jsObjects.find(obj => {
              return obj.b === 6
            })
          }

          ngModelCtrl.$asyncValidators.responseHeaderValidator = function(modelValue, viewValue) {
            //prevent requests if field is already invalid
            if (Object.keys(ngModelCtrl.$error).length >= 1 && !ngModelCtrl.$error.responseHeaderValidator) {
              return $q.resolve();
            }
            var value = modelValue || viewValue;
            return responseHeaderAnalyzer.validate(value)
              .catch(function(errorMessage){
                ngModelCtrl.customErrorMessage = errorMessage;
                return $q.reject();
              });
          };
        }
      };
    }
  ]);