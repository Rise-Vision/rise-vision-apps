'use strict';

angular.module('risevision.displays.services')
  .value('SCREENSHOT_PLAYER_VERSION', '2017.01.10.17.33')
  .value('OFFLINE_PLAY_PLAYER_VERSION', '2017.07.31.15.31')
  .value('DISPLAY_CONTROL_PLAYER_VERSION', '2018.01.15.16.31')
  .factory('playerProFactory', ['$rootScope', '$q', '$modal', 'userState',
    'displayTracker', 'storeAuthorization', '$loading', 'parsePlayerDate',
    'getLatestPlayerVersion', 'STORE_URL', 'IN_RVA_PATH',
    'PLAYER_PRO_PRODUCT_ID', 'PLAYER_PRO_PRODUCT_CODE',
    'SCREENSHOT_PLAYER_VERSION', 'OFFLINE_PLAY_PLAYER_VERSION', 'DISPLAY_CONTROL_PLAYER_VERSION',
    function ($rootScope, $q, $modal, userState, displayTracker, storeAuthorization,
      $loading, parsePlayerDate, getLatestPlayerVersion,
      STORE_URL, IN_RVA_PATH, PLAYER_PRO_PRODUCT_ID, PLAYER_PRO_PRODUCT_CODE,
      SCREENSHOT_PLAYER_VERSION, OFFLINE_PLAY_PLAYER_VERSION, DISPLAY_CONTROL_PLAYER_VERSION) {
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

      factory.is3rdPartyPlayer = function (display) {
        display = display || {};
        var playerName = (display.playerName || '').toLowerCase();
        var playerVersion = (display.playerVersion || '').toLowerCase();
        var os = (display.os || '').toLowerCase();
        var isCAP = playerName === 'riseplayerpackagedapp';
        var isRisePlayer = playerName.indexOf('riseplayer') !== -1;
        var isCenique = (playerName + playerVersion).indexOf('cenique') !== -1;
        var isAndroid = os.indexOf('android') !== -1;
        var isCROS = (os.indexOf('cros') !== -1 && os.indexOf('microsoft') === -1);

        return !!playerName && (isCAP || isCROS || isAndroid || isCenique || !isRisePlayer);
      };

      factory.isElectronPlayer = function (display) {
        return !!(display && display.playerName &&
          display.playerName.indexOf('RisePlayerElectron') !== -1);
      };

      factory.isUnsupportedPlayer = function (display) {
        return !!(display && !factory.is3rdPartyPlayer(display) && !factory.isElectronPlayer(display));
      };

      factory.isOutdatedPlayer = function (display) {
        var displayPlayerVersion = display && parsePlayerDate(display.playerVersion);
        var minimumVersion = _latestPlayerVersion &&
          new Date(_latestPlayerVersion).setMonth(_latestPlayerVersion.getMonth() - 3);
        var upToDate = displayPlayerVersion && minimumVersion && displayPlayerVersion >= minimumVersion;

        return !factory.is3rdPartyPlayer(display) &&
          !factory.isUnsupportedPlayer(display) &&
          (!factory.isElectronPlayer(display) || !upToDate);
      };

      factory.isScreenshotCompatiblePlayer = function (display) {
        return !!(display && factory.isElectronPlayer(display) &&
          display.playerVersion >= SCREENSHOT_PLAYER_VERSION);
      };

      factory.isOfflinePlayCompatiblePayer = function (display) {
        return !!(display && factory.isElectronPlayer(display) &&
          display.playerVersion >= OFFLINE_PLAY_PLAYER_VERSION);
      };

      factory.isDisplayControlCompatiblePlayer = function (display) {
        return !!(display && factory.isElectronPlayer(display) &&
          display.playerVersion >= DISPLAY_CONTROL_PLAYER_VERSION);
      };

      factory.openPlayerProInfoModal = function (display) {
        displayTracker('Player Pro Info Modal');

        return $modal.open({
          templateUrl: 'partials/displays/player-pro-info-modal.html',
          size: 'lg',
          controller: 'PlayerProInfoModalCtrl',
          resolve: {
            displayInfo: function () {
              return display;
            }
          }
        });
      };

      factory.openConfigureDisplayControl = function (display) {
        var deferred = $q.resolve();

        if (!display.offlineSubscription) {
          deferred = factory.openPlayerProInfoModal();
        }

        return deferred.then(function () {
          return $modal.open({
            templateUrl: 'partials/displays/display-control-modal.html',
            size: 'lg',
            controller: 'DisplayControlModalCtrl'
          });
        });
      };

      factory.startPlayerProTrial = function () {
        displayTracker('Starting Player Pro Trial');

        $loading.start('loading-trial');
        return storeAuthorization.startTrial(PLAYER_PRO_PRODUCT_CODE)
          .then(function () {
            displayTracker('Started Trial Player Pro');
            $loading.stop('loading-trial');
            $rootScope.$emit('refreshSubscriptionStatus', 'trial-available');
          }, function (e) {
            $loading.stop('loading-trial');
            return $q.reject();
          });
      };

      return factory;
    }
  ]);
