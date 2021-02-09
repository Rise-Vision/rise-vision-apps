(function (angular) {
  'use strict';
  angular.module('risevision.common.components.timeline')
    .directive('weekdayDropdown',
      function () {
        return {
          restrict: 'E',
          scope: {
            weekday: '='
          },
          templateUrl: 'partials/components/timeline/weekday-dropdown.html'
        };
      }
    );
})(angular);
