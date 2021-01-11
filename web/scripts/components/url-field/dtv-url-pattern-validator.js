'use strict';

angular.module('risevision.widget.common.url-field.url-pattern-validator', [
    'risevision.template-editor.services'
  ])
  .directive('urlPatternValidator', ['componentUtils',
    function (componentUtils) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          var validator = function (value) {
            if (!value || componentUtils.isValidUrl(value)) {
              ngModelCtrl.$setValidity('pattern', true);
            } else {
              ngModelCtrl.$setValidity('pattern', false);
            }

            if (value && (value.indexOf('preview.risevision.com') > -1 ||
              value.indexOf('widgets.risevision.com/viewer') > -1)) {
              ngModelCtrl.$setValidity('noPreviewUrl', false);
            } else {
              ngModelCtrl.$setValidity('noPreviewUrl', true);
            }
            return value;
          };
          ngModelCtrl.$parsers.unshift(validator);
          ngModelCtrl.$formatters.unshift(validator);
        }
      };
    }
  ]);
