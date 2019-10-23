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
            'partials/components/background-image-setting/url-field.html'),
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

            scope.$watch('ngModel', function (newValue,oldValue) {
              if (newValue !== oldValue) {
                scope.urlCtrl.$setDirty(true);
              }
            });

            scope.$watch('doValidation', function (doValidation) {
              scope.forcedValid = !doValidation;
              if (scope.forcedValid) {
                clearFormErros();
              }
            });

            var clearFormErros = function () {
              angular.forEach(scope.urlCtrl.$error, function (value, name) {
                scope.urlCtrl.$setValidity(name, null);
              });
            };
          }
        };
      }
    ])

.directive('urlPatternValidator', ['componentUtils',
    function (componentUtils) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModelCtrl) {
          var validator = function (value) {
            if (value && componentUtils.isValidUrl(value)) {
              ngModelCtrl.$setValidity('pattern', true);
            } else {
              ngModelCtrl.$setValidity('pattern', false);
            }

            if (value && value.indexOf('preview.risevision.com') > -1) {
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
  ])

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
  ])

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
  ])
;




    ;
}());
