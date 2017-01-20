'use strict';

// Status Filter
angular.module('risevision.displays.filters')
  .filter('status', function () {
    return function (display) {
      if (angular.isUndefined(display)) {
        return 'notinstalled';
      } else {
        if (display.blockExpiryDate) {
          return 'blocked';
        } else if (display.onlineStatus === 'online') {
          return 'online';
        } else if (display.playerVersion) {
          if (display.playerErrorCode && display.playerErrorCode !== 0) {
            return 'error';
          } else {
            return 'offline';
          }
        } else {
          return 'notinstalled';
        }
      }
    };
  });
