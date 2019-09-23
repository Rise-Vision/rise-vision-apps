'use strict';

angular.module('risevision.common.components.purchase-flow')
  .directive('yearSelector', ['$templateCache',
    function ($templateCache) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/components/purchase-flow/year-selector.html'),
        replace: 'true',
        scope: {
          ngModel: '=?'
        },
        controller: ['$scope',
          function ($scope) {
            var baseYear = new Date().getFullYear();
            var MAX_COUNT = 20;

            $scope.init = function () {
              $scope.years = [];

              if ($scope.ngModel && $scope.ngModel < baseYear) {
                $scope.years.push(($scope.ngModel).toString());
              }

              for (var i = 0; i < MAX_COUNT; i++) {
                $scope.years.push((baseYear + i).toString());
              }
            };

            $scope.init();
          }
        ]

      };
    }
  ]);
