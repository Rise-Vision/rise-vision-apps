(function () {
  'use strict';

  angular.module('risevision.widget.common.url-field',[
      'risevision.widget.common.url-field.file-type-validator',
      'risevision.widget.common.url-field.response-header-validator',
      'risevision.widget.common.url-field.url-pattern-validator'
    ])
    .value('VALID_FILE_TYPES', {
      image: ['.jpg', '.jpeg', '.png', '.bmp', '.svg', '.gif', '.webp'],
      video: ['.webm', '.mp4', '.ogv', '.ogg']
    })
    .directive('urlField', ['$templateCache', '$log', 'componentUtils',
      function ($templateCache, $log, componentUtils) {
        return {
          restrict: 'E',
          require: '?ngModel',
          scope: {
            ngModel: '=',
            label: '@',
            hideLabel: '@',
            hideStorage: '@',
            companyId: '@',
            fileType: '@',
            storageType: '@',
          },
          template: $templateCache.get(
            'partials/components/url-field/url-field.html'),
          link: function (scope, element, attrs, ctrl) {
            scope.urlCtrl = ctrl;
            scope.doValidation = true;
            scope.forcedValid = false;

            if (!scope.hideStorage) {
              scope.$on('picked', function (event, data) {
                scope.ngModel = data[0];
              });
            }

            scope.blur = function () {
              scope.$emit('urlFieldBlur');
            };

            scope.$watch('ngModel', function (newValue, oldValue) {
              if (newValue !== oldValue) {
                scope.urlCtrl.$setDirty(true);
              }
            });

            scope.$watch('doValidation', function (doValidation) {
              scope.forcedValid = !doValidation;
              if (scope.forcedValid) {
                clearFormErrors();
              }
            });

            var clearFormErrors = function () {
              angular.forEach(scope.urlCtrl.$error, function (value, name) {
                scope.urlCtrl.$setValidity(name, null);
              });
            };
          }
        };
      }
    ]);
}());
