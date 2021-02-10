'use strict';

angular.module('risevision.template-editor.filters')
  .filter('encodeLink', function () {
    return window.encodeURIComponent;
  });
