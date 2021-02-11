(function () {
  'use strict';

  angular.module('risevision.common.components.repeat-setting', [
      'risevision.common.i18n'
    ])
    .directive('repeatSetting', ['$templateCache',
      function ($templateCache) {
        return {
          restrict: 'E',
          scope: {
            repeat: '=',
            hideLabel: '@',
            parentContainerClass: '=',
            containerClass: '=',
            'disabled': '='
          },
          template: $templateCache.get(
            'partials/components/background-image-setting/repeat-setting.html')
        };
      }
    ]);
}());
