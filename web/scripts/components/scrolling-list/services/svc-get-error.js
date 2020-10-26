'use strict';

angular.module('risevision.common.components.scrolling-list')
  .service('getError', [
    function () {
      return function (e) {
        if (e) {
          if (e.result) {
            if (e.result.error) {
              return e.result.error;
            } else {
              return e.result;
            }
          } else if (e.error) {
            return e.error;
          } else {
            return e;
          }
        } else {
          return {};
        }
      };
    }
  ]);
