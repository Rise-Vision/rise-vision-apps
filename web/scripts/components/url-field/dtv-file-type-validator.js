'use strict';

angular.module('risevision.widget.common.url-field.file-type-validator', [
    'risevision.storage.services'
  ])
  .directive('fileTypeValidator', ['SELECTOR_FILTERS',
    function (SELECTOR_FILTERS) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          var selectorType = SELECTOR_FILTERS[attr.fileTypeValidator] || {};
          var allowedExtensions = selectorType.extensions || [];

          var hasValidExtension = function (url, fileType) {
            var testUrl = url.toLowerCase();
            for (var i = 0, len = allowedExtensions.length; i < len; i++) {
              if (testUrl.indexOf(allowedExtensions[i]) !== -1) {
                return true;
              }
            }
            return false;
          };

          var validator = function (value) {
            if (!value || hasValidExtension(value, attr.fileTypeValidator)) {
              ngModelCtrl.$setValidity('fileType', true);
            } else {
              ngModelCtrl.customErrorMessage = 'Please provide a valid file type. (' + allowedExtensions.join(
                ', ') + ')';
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
