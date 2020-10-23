'use strict';

angular.module('risevision.apps.purchase')
  .directive('suggestGeneralDelivery', ['$templateCache', 'addressFactory',
    function ($templateCache, addressFactory) {
      return {
        restrict: 'E',
        scope: {
          addressObject: '='
        },
        template: $templateCache.get('partials/purchase/suggest-general-delivery.html'),
        link: function ($scope) {
          $scope.addressFactory = addressFactory;
        }
      };
    }
  ]);
