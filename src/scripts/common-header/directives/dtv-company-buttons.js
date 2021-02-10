'use strict';

angular.module('risevision.common.header.directives')
  .directive('companyButtons', ['$templateCache',
    function ($templateCache) {
      return {
        restrict: 'E',
        scope: false,
        replace: true,
        template: $templateCache.get('partials/common-header/company-buttons-menu.html'),
        link: function () {} //link()
      };
    }
  ]);
