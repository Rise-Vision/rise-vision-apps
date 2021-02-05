(function (angular) {
  'use strict';
  angular.module('risevision.common.components.timeline')
    .directive('monthDropdown',
      function () {
        return {
          restrict: 'E',
          scope: {
            month: '='
          },
          templateUrl: 'partials/components/timeline/month-dropdown.html'
        };
      }
    );
})(angular);
