'use strict';

angular.module('risevision.displays.directives')
  .directive('displayAddress', ['COUNTRIES', 'REGIONS_CA', 'REGIONS_US', 'TIMEZONES',
    function (COUNTRIES, REGIONS_CA, REGIONS_US, TIMEZONES) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          display: '=?'
        },
        templateUrl: 'partials/displays/display-address.html',
        link: function ($scope) {
          $scope.countries = COUNTRIES;
          $scope.regionsCA = REGIONS_CA;
          $scope.regionsUS = REGIONS_US;
          $scope.timezones = TIMEZONES;
        } //link()
      };
    }
  ]);
