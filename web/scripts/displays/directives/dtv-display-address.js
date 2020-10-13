'use strict';

angular.module('risevision.displays.directives')
  .directive('displayAddress', ['COUNTRIES', 'REGIONS_CA', 'REGIONS_US', 'TIMEZONES', 'displayFactory',
    function (COUNTRIES, REGIONS_CA, REGIONS_US, TIMEZONES, displayFactory) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          ngModel: '=?'
        },
        templateUrl: 'partials/displays/display-address.html',
        link: function ($scope) {
          $scope.factory = displayFactory;
          if ($scope.ngModel) {
            $scope.factory = { display: $scope.ngModel };
          }

          $scope.countries = COUNTRIES;
          $scope.regionsCA = REGIONS_CA;
          $scope.regionsUS = REGIONS_US;
          $scope.timezones = TIMEZONES;
        } //link()
      };
    }
  ]);
