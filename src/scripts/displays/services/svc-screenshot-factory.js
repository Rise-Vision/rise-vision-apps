'use strict';

angular.module('risevision.displays.services')
  .factory('screenshotFactory', ['displayFactory', 'display', 'imageBlobLoader',
    function (displayFactory, display, imageBlobLoader) {
      var factory = {};

      factory.requestScreenshot = function () {
        if (displayFactory.showLicenseRequired()) {
          return;
        }

        factory.screenshotLoading = true;

        return display.requestScreenshot(displayFactory.display.id)
          .then(function () {
            return factory.loadScreenshot();
          })
          .catch(function (err) {
            factory.screenshotLoading = false;

            factory.screenshot = {
              error: 'requesting'
            };
            console.log('Error requesting screenshot', err);
          });
      };

      factory.loadScreenshot = function () {
        factory.screenshotLoading = true;

        var url =
          'https://storage.googleapis.com/risevision-display-screenshots/' +
          displayFactory.display.id + '.jpg';

        return imageBlobLoader(url)
          .then(function (resp) {
            factory.screenshotLoading = false;
            factory.screenshot = resp;
          })
          .catch(function (err) {
            factory.screenshotLoading = false;
            factory.screenshot = {
              error: 'loading'
            };
            console.log('Error loading screenshot', err);
          });
      };

      return factory;
    }
  ]);
