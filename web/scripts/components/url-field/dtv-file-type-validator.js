'use strict';

angular.module('risevision.widget.common.url-field')
.directive('fileTypeValidator', ['VALID_FILE_TYPES',
    function (VALID_FILE_TYPES) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          var hasValidExtension = function (url, fileType) {
            var testUrl = url.toLowerCase();
            var extensions = VALID_FILE_TYPES[fileType] || [];
            for (var i = 0, len = extensions.length; i < len; i++) {
              if (testUrl.indexOf(extensions[i]) !== -1) {
                return true;
              }
            }
            return false;
          };

          var validator = function (value) {
            if (hasValidExtension(value, attr.fileTypeValidator)) {
              ngModelCtrl.$setValidity('fileType', true);
            } else {
              ngModelCtrl.customErrorMessage = 'Please provide a valid file type. ('+VALID_FILE_TYPES[attr.fileTypeValidator].join(', ')+')';
              ngModelCtrl.$setValidity('fileType', false);
            }
            return value;
          };
          ngModelCtrl.$parsers.unshift(validator);
          ngModelCtrl.$formatters.unshift(validator);
        }
      };
    }
  ]);