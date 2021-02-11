'use strict';

angular.module('risevision.apps.purchase')
  .directive('purchaseFooter', ['$templateCache', 'helpWidgetFactory',
    function ($templateCache, helpWidgetFactory) {
      return {
        restrict: 'E',
        scope: {},
        template: $templateCache.get('partials/purchase/purchase-footer.html'),
        link: function ($scope) {
          $scope.helpWidgetFactory = helpWidgetFactory;
        }
      };
    }
  ]);
