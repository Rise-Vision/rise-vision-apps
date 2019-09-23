(function () {
  'use strict';

  angular.module('risevision.widget.common.url-field', [
      'risevision.common.i18n',
      'risevision.widget.common.storage-selector'
    ])
    .directive('urlField', ['$templateCache', '$log',
      function ($templateCache, $log) {
        return {
          restrict: 'E',
          require: '?ngModel',
          scope: {
            url: '=',
            hideLabel: '@',
            hideStorage: '@',
            companyId: '@',
            fileType: '@',
            storageType: '@'
          },
          template: $templateCache.get(
            'partials/components/background-image-setting/url-field.html'),
          link: function (scope, element, attrs, ctrl) {

            function hasValidExtension(url, fileType) {
              var testUrl = url.toLowerCase(),
                extensions;

              switch (fileType) {
              case 'image':
                extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.svg',
                  '.gif'
                ];
                break;
              case 'video':
                extensions = ['.webm', '.mp4', '.ogv', '.ogg'];
                break;
              default:
                extensions = [];
              }

              for (var i = 0, len = extensions.length; i < len; i++) {
                if (testUrl.indexOf(extensions[i]) !== -1) {
                  return true;
                }
              }

              return false;
            }


            function testUrl(value) {
              var urlRegExp,
                isValid;

              /*
             Discussion
             http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links#21925491

             Using
             https://gist.github.com/dperini/729294
             Reasoning
             http://mathiasbynens.be/demo/url-regex */

              urlRegExp =
                /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; // jshint ignore:line

              // Add http:// if no protocol parameter exists
              if (value.indexOf('://') === -1) {
                value = 'http://' + value;
              }

              isValid = urlRegExp.test(value);

              if (isValid && typeof scope.fileType !== 'undefined') {
                isValid = hasValidExtension(value, scope.fileType);
                if (!isValid) {
                  scope.invalidType = scope.fileType;
                }
              } else {
                scope.invalidType = 'url';
              }

              return isValid;
            }

            // By default enforce validation
            scope.doValidation = true;
            // A flag to set if the user turned off validation
            scope.forcedValid = false;
            // Validation state
            scope.valid = true;

            scope.invalidType = 'url';

            scope.allowInitEmpty = (typeof attrs.initEmpty !== 'undefined');

            if (!scope.hideStorage) {
              scope.$on('picked', function (event, data) {
                scope.url = data[0];
              });
            }

            scope.blur = function () {
              scope.$emit('urlFieldBlur');
            };

            scope.$watch('url', function (url) {
              if (typeof url !== 'undefined' && url !== null) {

                if (url !== '' && scope.allowInitEmpty) {
                  // ensure an empty '' value now gets validated
                  scope.allowInitEmpty = false;
                }

                if (scope.doValidation && !scope.allowInitEmpty) {
                  scope.valid = testUrl(scope.url);
                }
              }
            });

            scope.$watch('valid', function (valid) {
              if (ctrl) {
                $log.info('Calling $setValidity() on parent controller');
                ctrl.$setValidity('valid', valid);
              }
            });

            scope.$watch('doValidation', function (doValidation) {
              if (typeof scope.url !== 'undefined') {
                if (doValidation) {
                  scope.forcedValid = false;

                  if (!scope.allowInitEmpty) {
                    scope.valid = testUrl(scope.url);
                  }
                } else {
                  scope.forcedValid = true;
                  scope.valid = true;
                }
              }
            });

          }
        };
      }
    ]);
}());
