'use strict';

angular.module('risevision.common.components.purchase-flow')
  .directive('suggestGeneralDelivery', ['$templateCache', 'addressFactory',
    function ($templateCache, addressFactory) {
      return {
        restrict: 'E',
        scope: {
          addressObject: '='
        },
        template: $templateCache.get('partials/components/purchase-flow/suggest-general-delivery.html'),
        link: function ($scope) {
          $scope.addressFactory = addressFactory;
        }
      };
    }
  ]);
