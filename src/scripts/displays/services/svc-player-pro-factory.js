'use strict';

angular.module('risevision.displays.services')
  .value('PLAYER_VERSION_DATE_REGEX', /\d{4}\.\d{2}\.\d{2}\.*/)
  .value('SCREENSHOT_PLAYER_VERSION', '2017.01.10.17.33')
  .value('DISPLAY_CONTROL_PLAYER_VERSION', '2018.01.15.16.31')
  .value('CHROMEOS_PLAYER_VERSION', '2018.07.20.10229')
  .value('CHROMEOS_SCREENSHOT_PLAYER_VERSION', '2018.08.17.8388')
  .factory('playerProFactory', ['userState', 'PLAYER_VERSION_DATE_REGEX',
    'SCREENSHOT_PLAYER_VERSION', 'DISPLAY_CONTROL_PLAYER_VERSION',
    'CHROMEOS_PLAYER_VERSION', 'CHROMEOS_SCREENSHOT_PLAYER_VERSION',
    function (userState, PLAYER_VERSION_DATE_REGEX,
      SCREENSHOT_PLAYER_VERSION, DISPLAY_CONTROL_PLAYER_VERSION,
      CHROMEOS_PLAYER_VERSION, CHROMEOS_SCREENSHOT_PLAYER_VERSION) {
      var factory = {};

      var _compareVersion = function (minimumVersion, currentVersion) {
        return PLAYER_VERSION_DATE_REGEX.test(currentVersion) && currentVersion >= minimumVersion;
      };

      factory.isCROSLegacy = function (display) {
        var os = (display && display.os || '').toLowerCase();

        return (os.indexOf('cros') !== -1 && os.indexOf('microsoft') === -1);
      };

      factory.isElectronPlayer = function (display) {
        return !!(display && display.playerName &&
          display.playerName.indexOf('RisePlayerElectron') !== -1);
      };

      factory.isChromeOSPlayer = function (display) {
        return !!(display && display.playerName && display.playerName.indexOf('RisePlayer') !== -1 &&
          !factory.isElectronPlayer(display) && _compareVersion(CHROMEOS_PLAYER_VERSION, display.playerVersion));
      };

      factory.isWebPlayer = function (display) {
        return !!(display && display.playerName &&
          display.playerName.indexOf('Web Player') !== -1);
      };

      factory.isAndroidPlayer = function (display) {
        return !!(display && display.playerName &&
          display.playerName.indexOf('Android Player') !== -1);
      };

      factory.isScreenshotCompatiblePlayer = function (display) {
        var electronSupported = factory.isElectronPlayer(display) && _compareVersion(SCREENSHOT_PLAYER_VERSION,
          display.playerVersion);
        var chromeOSSupported = factory.isChromeOSPlayer(display) && _compareVersion(
          CHROMEOS_SCREENSHOT_PLAYER_VERSION, display.playerVersion);

        return electronSupported || chromeOSSupported;
      };

      factory.isDisplayControlCompatiblePlayer = function (display) {
        return !!(display && factory.isElectronPlayer(display) &&
          _compareVersion(DISPLAY_CONTROL_PLAYER_VERSION, display.playerVersion) &&
          display.playerProAuthorized);
      };

      return factory;
    }
  ]);
