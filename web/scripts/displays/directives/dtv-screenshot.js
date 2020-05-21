'use strict';

angular.module('risevision.displays.directives')
  .directive('screenshot', ['$filter', 'display', 'screenshotFactory',
    'playerProFactory', 'displayFactory',
    function ($filter, displayService, screenshotFactory, playerProFactory, displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/screenshot.html',
        link: function ($scope) {
          $scope.screenshotFactory = screenshotFactory;
          $scope.displayFactory = displayFactory;

          $scope.screenshotState = function (display) {
            var statusFilter = $filter('status');

            if (display && displayFactory.showLicenseRequired(display)) {
              return 'no-license';
            } else if (!display || displayService.statusLoading || screenshotFactory.screenshotLoading) {
              return 'loading';
            } else if (display.os && display.os.indexOf('cros') === 0) {
              return 'os-not-supported';
            } else if (statusFilter(display) === 'notinstalled') {
              return 'not-installed';
            } else if (!playerProFactory.isScreenshotCompatiblePlayer(display)) {
              return 'upgrade-player';
            } else if (!displayService.hasSchedule(display)) {
              return 'no-schedule';
            } else if (statusFilter(display) === 'offline' && screenshotFactory.screenshot &&
              screenshotFactory.screenshot.lastModified) {
              return 'offline-screenshot-loaded';
            } else if (statusFilter(display) === 'offline') {
              return 'offline';
            } else if (screenshotFactory.screenshot && screenshotFactory.screenshot.lastModified) {
              return 'screenshot-loaded';
            } else if (screenshotFactory.screenshot && (screenshotFactory.screenshot.status === 404 ||
                screenshotFactory.screenshot.status === 403)) {
              return 'no-screenshot-available';
            } else if (screenshotFactory.screenshot && screenshotFactory.screenshot.error) {
              return 'screenshot-error';
            }

            return '';
          };

          $scope.reloadScreenshotDisabled = function (display) {
            return displayService.statusLoading || screenshotFactory.screenshotLoading || [
                'no-screenshot-available', 'screenshot-loaded'
              ]
              .indexOf($scope.screenshotState(display)) === -1;
          };

        } //link()
      };
    }
  ]);
