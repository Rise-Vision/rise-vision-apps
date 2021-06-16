'use strict';

angular.module('risevision.displays.directives')
  .directive('screenshot', ['screenshotFactory', 'displayFactory',
    function (screenshotFactory, displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/screenshot.html',
        replace: true,
        link: function ($scope) {
          $scope.screenshotFactory = screenshotFactory;

          $scope.screenshotState = function () {
            if (displayFactory.showLicenseRequired()) {
              return 'no-license';
            } else if (!displayFactory.display || screenshotFactory.screenshotLoading) {
              return 'loading';
            } else if (screenshotFactory.screenshot && screenshotFactory.screenshot.lastModified) {
              return 'screenshot-loaded';
            } else if (screenshotFactory.screenshot && screenshotFactory.screenshot.error) {
              return 'screenshot-error';
            }

            return '';
          };

          $scope.reloadScreenshotEnabled = function () {
            if (!displayFactory.display) {
              return false;
            }

            if (displayFactory.showLicenseRequired()) {
              return false;
            } else if (screenshotFactory.screenshotLoading || !screenshotFactory.screenshot) {
              return false;
            } else if (displayFactory.display.onlineStatus === 'online') {
              return true;
            }

            return false;
          };

        } //link()
      };
    }
  ]);
