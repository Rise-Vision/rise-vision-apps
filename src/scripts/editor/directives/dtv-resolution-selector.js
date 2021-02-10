'use strict';

angular.module('risevision.editor.directives')
  .directive('resolutionSelector', [
    function () {
      return {
        restrict: 'E',
        scope: false,
        templateUrl: 'partials/editor/resolution-selector.html',
        link: function (scope) {

          // view will show resolutions on the same order from this object declaration
          scope.resolutionOptions = {
            '1024x768': '1024 x 768',
            '1280x1024': '1280 x 1024',
            '1600x1200': '1600 x 1200',
            '1280x720': '1280 x 720 Wide',
            '1280x768': '1280 x 768 Wide',
            '1360x768': '1360 x 768 Wide',
            '1366x768': '1366 x 768 Wide',
            '1440x900': '1440 x 900 Wide',
            '1680x1050': '1680 x 1050 Wide',
            '1920x1080': '1920 x 1080 Wide',
            '3840x2160': '3840 x 2160 Wide',
            '720x1280': '720 x 1280 Portrait',
            '768x1280': '768 x 1280 Portrait',
            '768x1360': '768 x 1360 Portrait',
            '768x1366': '768 x 1366 Portrait',
            '1080x1920': '1080 x 1920 Portrait',
            '2160x3840': '2160 x 3840 Portrait',
            'custom': 'Custom'
          };

          if (scope.presentationProperties.width && scope.presentationProperties
            .height) {
            scope.resolutionOption = scope.presentationProperties.width +
              'x' + scope.presentationProperties.height;
            if (!(scope.resolutionOption in scope.resolutionOptions)) {
              scope.resolutionOption = 'custom';
            }
          }

          scope.updateResolution = function () {
            if (scope.resolutionOption !== 'custom') {
              var sizes = scope.resolutionOption.split('x');
              scope.presentationProperties.width = parseInt(sizes[0]);
              scope.presentationProperties.height = parseInt(sizes[1]);
            }
          };

          scope.objectKeys = function (obj) {
            return Object.keys(obj);
          };

        } //link()
      };
    }
  ]);
