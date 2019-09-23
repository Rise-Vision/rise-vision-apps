(function () {
  'use strict';

  angular.module('risevision.common.components.last-modified', [])
    .directive('lastModified', ['$templateCache',
      function ($templateCache) {
        return {
          restrict: 'E',
          scope: {
            changeDate: '=',
            changedBy: '='
          },
          template: $templateCache.get('partials/components/last-modified/last-modified.html'),
          link: function ($scope) {
            $scope.$watch('changedBy', function (newVal) {
              $scope.changedBy = newVal ? newVal : 'N/A';
            });
          } //link()
        };
      }
    ]);
}());
