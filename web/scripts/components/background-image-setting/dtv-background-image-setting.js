(function () {
  'use strict';

  angular.module(
      'risevision.common.components.background-image-setting', [
        'risevision.common.i18n',
        'colorpicker.module',
        'risevision.widget.common.url-field',
        'risevision.common.components.position-setting',
        'risevision.common.components.background-image',
        'risevision.common.components.repeat-setting'
      ])
    .directive('backgroundImageSetting', ['$templateCache',
      function ($templateCache) {
        return {
          restrict: 'E',
          scope: {
            background: '=',
            companyId: '@',
            colorParentContainerClass: '=',
            colorContainerClass: '=',
            positionParentContainerClass: '=',
            positionContainerClass: '=',
            repeatParentContainerClass: '=',
            repeatContainerClass: '='
          },
          template: $templateCache.get(
            'partials/components/background-image-setting/background-image-setting.html'
          ),
          link: function (scope) {

            scope.defaultSetting = {
              useImage: false,
              image: {
                url: '',
                position: 'top-left',
                scale: true,
                repeat: 'no-repeat'
              }
            };

            scope.defaults = function (obj) {
              if (obj) {
                for (var i = 1, length = arguments.length; i < length; i++) {
                  var source = arguments[i];

                  for (var prop in source) {
                    if (obj[prop] === void 0) {
                      obj[prop] = source[prop];
                    }
                  }
                }
              }
              return obj;
            };

            scope.imageLoaded = false;
            scope.imageUrl = '';

            scope.$watch('background', function (background) {
              scope.defaults(background, scope.defaultSetting);
            });

            scope.$watch('background.image.url', function (newUrl) {
              if (scope.imageUrl !== newUrl) {
                scope.imageUrl = newUrl;
              }
            });

            scope.$on('backgroundImageLoad', function (event, loaded) {
              scope.$apply(function () {
                scope.imageLoaded = loaded;
              });

            });

            scope.$on('urlFieldBlur', function () {
              scope.imageUrl = scope.background.image.url;
            });

          }
        };
      }
    ]);
}());
