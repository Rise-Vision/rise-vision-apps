'use strict';

angular.module('risevision.displays.services')
  .value('PLAYER_VERSION_DATE_REGEX', /\d{4}\.\d{2}\.\d{2}\.*/)
  .value('SCREENSHOT_PLAYER_VERSION', '2017.01.10.17.33')
  .value('OFFLINE_PLAY_PLAYER_VERSION', '2017.07.31.15.31')
  .value('DISPLAY_CONTROL_PLAYER_VERSION', '2018.01.15.16.31')
  .value('CHROMEOS_PLAYER_VERSION', '2018.07.20.10229')
  .value('CHROMEOS_SCREENSHOT_PLAYER_VERSION', '2018.08.17.8388')
  .factory('playerProFactory', ['$q', '$modal', 'userState',
    'parsePlayerDate',
    'getLatestPlayerVersion', 'STORE_URL', 'IN_RVA_PATH',
    'PLAYER_PRO_PRODUCT_ID', 'PLAYER_VERSION_DATE_REGEX',
    'SCREENSHOT_PLAYER_VERSION', 'OFFLINE_PLAY_PLAYER_VERSION', 'DISPLAY_CONTROL_PLAYER_VERSION',
    'CHROMEOS_PLAYER_VERSION', 'CHROMEOS_SCREENSHOT_PLAYER_VERSION',
    function ($q, $modal, userState,
      parsePlayerDate, getLatestPlayerVersion,
      STORE_URL, IN_RVA_PATH, PLAYER_PRO_PRODUCT_ID, PLAYER_VERSION_DATE_REGEX,
      SCREENSHOT_PLAYER_VERSION, OFFLINE_PLAY_PLAYER_VERSION, DISPLAY_CONTROL_PLAYER_VERSION,
      CHROMEOS_PLAYER_VERSION, CHROMEOS_SCREENSHOT_PLAYER_VERSION) {
      var factory = {};
      var _latestPlayerVersion;

      var _loadPlayerVersion = function () {
        getLatestPlayerVersion()
          .then(function (date) {
            _latestPlayerVersion = date;
          })
          .catch(function (err) {
            console.log('Error retrieving Player Version', err);
          });
      };

      _loadPlayerVersion();

      factory.getProductLink = function () {
        return (STORE_URL + IN_RVA_PATH
          .replace('productId', PLAYER_PRO_PRODUCT_ID)
          .replace('companyId', userState.getSelectedCompanyId()));
      };

      var _compareVersion = function (minimumVersion, currentVersion) {
        return PLAYER_VERSION_DATE_REGEX.test(currentVersion) && currentVersion >= minimumVersion;
      };

      factory.is3rdPartyPlayer = function (display) {
        display = display || {};
        var playerName = (display.playerName || '').toLowerCase();
        var playerVersion = (display.playerVersion || '').toLowerCase();
        var os = (display.os || '').toLowerCase();
        var isCAP = playerName === 'riseplayerpackagedapp';
        var isRisePlayer = playerName.indexOf('riseplayer') !== -1;
        var isCenique = (playerName + playerVersion).indexOf('cenique') !== -1;
        var isAndroid = os.indexOf('android') !== -1;
        var isCROSLegacy = factory.isCROSLegacy(display);

        return !!playerName && (isCAP || isCROSLegacy || isAndroid || isCenique || !isRisePlayer);
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

      factory.isUnsupportedPlayer = function (display) {
        var newDisplay = !(display && display.playerName && display.playerVersion);
        return !!(!newDisplay && !factory.isElectronPlayer(display) &&
          !factory.isChromeOSPlayer(display)) || factory.is3rdPartyPlayer(display);
      };

      factory.isOutdatedPlayer = function (display) {
        var displayPlayerVersion = display && parsePlayerDate(display.playerVersion);
        var minimumVersion = _latestPlayerVersion &&
          new Date(_latestPlayerVersion).setMonth(_latestPlayerVersion.getMonth() - 3);
        var upToDate = displayPlayerVersion && minimumVersion && displayPlayerVersion >= minimumVersion;

        return !factory.isUnsupportedPlayer(display) &&
          !factory.isChromeOSPlayer(display) &&
          (!factory.isElectronPlayer(display) || !upToDate);
      };

      factory.isScreenshotCompatiblePlayer = function (display) {
        var electronSupported = factory.isElectronPlayer(display) && _compareVersion(SCREENSHOT_PLAYER_VERSION, display.playerVersion);
        var chromeOSSupported = factory.isChromeOSPlayer(display) && _compareVersion(CHROMEOS_SCREENSHOT_PLAYER_VERSION, display.playerVersion);

        return electronSupported || chromeOSSupported;
      };

      factory.isOfflinePlayCompatiblePayer = function (display) {
        return !!(display && factory.isElectronPlayer(display) &&
          _compareVersion(OFFLINE_PLAY_PLAYER_VERSION, display.playerVersion));
      };

      factory.isDisplayControlCompatiblePlayer = function (display) {
        return !!(display && factory.isElectronPlayer(display) &&
          _compareVersion(DISPLAY_CONTROL_PLAYER_VERSION, display.playerVersion) &&
          display.playerProAuthorized);
      };

      factory.openConfigureDisplayControl = function (display) {
        var deferred = $q.resolve();

        return deferred.then(function () {
          return $modal.open({
            templateUrl: 'partials/displays/display-control-modal.html',
            size: 'lg',
            controller: 'DisplayControlModalCtrl'
          });
        });
      };

      return factory;
    }
  ]);
