'use strict';

angular.module('risevision.widget.common.url-field.insecure-url', [])
  .service('insecureUrl', [
    function () {
      return function (url) {
        return !!(url && url.startsWith('http://'));
      };
    }
  ]);
