(function () {
  'use strict';

  angular.module('risevision.widget.common.url-field', [
      'risevision.common.i18n',
      'risevision.widget.common.storage-selector'
    ])
    .value('VALID_FILE_TYPES', {
      image: ['.jpg', '.jpeg', '.png', '.bmp', '.svg', '.gif', '.webp'],
      video: ['.webm', '.mp4', '.ogv', '.ogg']
    })
    .directive('urlField', ['$templateCache', '$log', 'VALID_FILE_TYPES', 'componentUtils',
      function ($templateCache, $log, VALID_FILE_TYPES, componentUtils) {
        return {
          restrict: 'E',
          scope: {
            url: '=',
            customValidator: '=',
            label: '@',
            hideLabel: '@',
            hideStorage: '@',
            companyId: '@',
            fileType: '@',
            storageType: '@'
          },
          template: $templateCache.get(
            'partials/components/background-image-setting/url-field.html'),
          link: function (scope, element, attrs, ctrl) {
            scope.doValidation = true;
            scope.forcedValid = false;
            scope.validFileTypes = VALID_FILE_TYPES;

            if (!scope.hideStorage) {
              scope.$on('picked', function (event, data) {
                scope.url = data[0];
              });
            }

            scope.blur = function () {
              scope.$emit('urlFieldBlur');
              checkCustomValidation();
            };

            scope.$watch('url', function (url) {
              checkValidation();
            });

            scope.$watch('doValidation', function (doValidation) {
              scope.forcedValid = !doValidation;
              checkValidation();
              checkCustomValidation();
            });

            var checkValidation = function () {
              clearFormErros();
              if (scope.doValidation) {
                if (scope.url) {
                  scope.urlForm.url.$setValidity('pattern', componentUtils.isValidUrl(scope.url));

                  if (scope.fileType) {
                    var valid = hasValidExtension(scope.url, scope.fileType);
                    scope.urlForm.url.$setValidity('fileType', valid);
                  }
                } else {
                  scope.urlForm.url.$setValidity('required', false);
                }
              }
            };

            var checkCustomValidation = function () {
              if (scope.doValidation && scope.customValidator && scope.urlForm.url.$valid) {

                scope.customValidator(scope.url).then(function () {
                  scope.urlForm.url.$setValidity('customError', true);

                }).catch(function (errorMessage) {
                  scope.customErrorMessage = errorMessage;
                  scope.urlForm.url.$setValidity('customError', false);
                });
              }
            };

            var clearFormErros = function () {
              angular.forEach(scope.urlForm, function (ctrl, name) {
                if (name.indexOf('$') !== 0) {
                  angular.forEach(ctrl.$error, function (value, name) {
                    ctrl.$setValidity(name, null);
                  });
                }
              });
            };

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

          }
        };
      }
    ]);
}());
