'use strict';

angular.module('risevision.displays.directives')
  .directive('displayFields', ['$sce', 'COUNTRIES', 'REGIONS_CA', 'REGIONS_US',
    'TIMEZONES', 'SHARED_SCHEDULE_URL',
    function ($sce, COUNTRIES, REGIONS_CA, REGIONS_US, TIMEZONES, SHARED_SCHEDULE_URL) {
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

          $scope.getEmbedUrl = function (scheduleId) {
            if (!scheduleId) {
              return null;
            }

            var url = SHARED_SCHEDULE_URL.replace('SCHEDULE_ID', scheduleId) +
              '&env=apps_display';

            return $sce.trustAsResourceUrl(url);
          };

        } //link()
      };
    }
  ]);
