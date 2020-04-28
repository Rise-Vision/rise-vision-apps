(function () {
  'use strict';

  angular.module('risevision.widget.common.url-field', [
      'risevision.widget.common.url-field.file-type-validator',
      'risevision.widget.common.url-field.response-header-validator',
      'risevision.widget.common.url-field.url-pattern-validator'
    ])
    .directive('urlField', ['$templateCache',
      function ($templateCache) {
        return {
          restrict: 'E',
          require: '?ngModel',
          scope: {
            ngModel: '=',
            label: '@',
            hideLabel: '@',
            hideStorage: '@',
            companyId: '@',
            storageType: '@',
          },
          template: $templateCache.get(
            'partials/components/url-field/url-field.html'),
          link: function (scope, element, attrs, ctrl) {
            scope.ngModelCtrl = ctrl;
            scope.doValidation = true;
            scope.forcedValid = false;

            if (!scope.hideStorage || scope.hideStorage === 'false') {
              scope.$on('picked', function (event, data) {
                scope.ngModel = data[0];
              });
            }

            scope.blur = function () {
              scope.$emit('urlFieldBlur');
            };

            scope.showSkipValidation = function () {
              var skipValidation = scope.forcedValid || (scope.ngModelCtrl.$invalid && scope.ngModelCtrl
              .$dirty);
              var unskippable = false;

              angular.forEach(scope.ngModelCtrl.$error, function (value, name) {
                if (name === 'required' || name === 'noPreviewUrl') {
                  unskippable = true;
                }
              });

              return !unskippable && skipValidation;
            };

            scope.$watch('ngModel', function (newValue, oldValue) {
              if (newValue !== oldValue) {
                scope.ngModelCtrl.$setDirty(true);
              }
            });

            scope.$watch('doValidation', function (doValidation) {
              scope.forcedValid = !doValidation;
              if (scope.forcedValid) {
                clearFormErrors();
              }
            });

            var clearFormErrors = function () {
              angular.forEach(scope.ngModelCtrl.$error, function (value, name) {
                scope.ngModelCtrl.$setValidity(name, null);
              });
            };
          }
        };
      }
    ]);
}());
