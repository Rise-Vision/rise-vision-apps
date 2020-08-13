'use strict';

angular.module('risevision.displays.directives')
  .directive('screenshot', ['$filter', 'display', 'screenshotFactory',
    'playerProFactory', 'displayFactory',
    function ($filter, displayService, screenshotFactory, playerProFactory, displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/screenshot.html',
        replace: true,
        link: function ($scope) {
          $scope.screenshotFactory = screenshotFactory;

          $scope.screenshotState = function (display) {
            if (displayFactory.showLicenseRequired(display)) {
              return 'no-license';
            } else if (!display || displayService.statusLoading || screenshotFactory.screenshotLoading) {
              return 'loading';
            } else if (screenshotFactory.screenshot && screenshotFactory.screenshot.lastModified) {
              return 'screenshot-loaded';
            } else if (screenshotFactory.screenshot && screenshotFactory.screenshot.error) {
              return 'screenshot-error';
            }

            return '';
          };

          $scope.reloadScreenshotEnabled = function (display) {
            var statusFilter = $filter('status');

            if (displayFactory.showLicenseRequired(display)) {
              return false;
            } else if (displayService.statusLoading || screenshotFactory.screenshotLoading || !screenshotFactory
              .screenshot) {
              return false;
            } else if (display.os && display.os.indexOf('cros') === 0) {
              return false;
            } else if (!playerProFactory.isScreenshotCompatiblePlayer(display)) {
              return false;
            } else if (statusFilter(display) === 'online') {
              return true;
            }

            return false;
          };

        } //link()
      };
    }
  ]);
