'use strict';

// Resolution Filter
angular.module('risevision.displays.filters')
  .filter('resolution', function () {
    return function (width, height) {
      if (width && height) {
        return width + 'x' + height;
      } else {
        return 'N/A';
      }
    };
  });
