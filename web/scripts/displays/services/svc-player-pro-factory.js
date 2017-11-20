'use strict';

angular.module('risevision.displays.services')
  .factory('playerProFactory', ['$rootScope', '$q', '$modal', 'displayTracker', 
    'storeAuthorization', '$loading', 'parsePlayerDate', 
    'getLatestPlayerVersion', 'PLAYER_PRO_PRODUCT_CODE',
    function ($rootScope, $q, $modal, displayTracker, storeAuthorization, 
      $loading, parsePlayerDate, getLatestPlayerVersion,
      PLAYER_PRO_PRODUCT_CODE) {
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

      factory.isUnsupportedPlayer = function (display) {
        return !!(display && !factory.is3rdPartyPlayer(display) &&
          display.playerName && display.playerName !== 'RisePlayerElectron');
      };

      factory.isOutdatedPlayer = function (display) {
        var displayPlayerVersion = display && parsePlayerDate(display.playerVersion);
        var minimumVersion = _latestPlayerVersion && (new Date()).setMonth(_latestPlayerVersion.getMonth() - 1);
        var upToDate = displayPlayerVersion && minimumVersion && displayPlayerVersion >= minimumVersion;

        return !factory.is3rdPartyPlayer(display) &&
          !factory.isUnsupportedPlayer(display) &&
          (display && display.playerName && (display.playerName !== 'RisePlayerElectron' || !upToDate));
      };

      factory.isProCompatiblePlayer = function (display) {
        return !!(display && display.playerName === 'RisePlayerElectron' &&
          display.playerVersion >= '2017.07.31.15.31');
      };

      factory.startPlayerProTrialModal = function () {
        displayTracker('Start Player Pro Trial Modal');

        return $modal.open({
          templateUrl: 'partials/displays/player-pro-trial-modal.html',
          size: 'lg',
          controller: 'PlayerProTrialModalCtrl'
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
