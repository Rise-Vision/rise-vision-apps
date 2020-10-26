'use strict';

// Status Filter
angular.module('risevision.displays.filters')
  .filter('status', function () {
    return function (onlineStatus) {
      switch(onlineStatus) {
        case 'online':
          return 'Online';
        case 'offline':
          return 'Offline';
        default:
          return 'Not Activated';
      }
    };
  });
