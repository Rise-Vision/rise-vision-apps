'use strict';

angular.module('risevision.displays.directives')
  .directive('displayFields', ['COUNTRIES', 'REGIONS_CA', 'REGIONS_US',
    'TIMEZONES',
    function (COUNTRIES, REGIONS_CA, REGIONS_US, TIMEZONES) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-fields.html',
        link: function ($scope) {
            $scope.countries = COUNTRIES;
            $scope.regionsCA = REGIONS_CA;
            $scope.regionsUS = REGIONS_US;
            $scope.timezones = TIMEZONES;

            $scope.isChromeOs = function (display) {
              return display && display.os && (display.os.indexOf('cros') !==
                -1 && display.os.indexOf('icrosoft') === -1);
            };

            $scope.canReboot = function (display) {
              // Cannot reboot Linux/Windows/Mac PackagedApp players
              return ($scope.isChromeOs(display) || display.playerName !==
                'RisePlayerPackagedApp');
            };
          } //link()
      };
    }
  ]);
