'use strict';

angular.module('risevision.displays.services')
  .factory('displayFactory', ['$rootScope', '$q', '$state', '$modal',
    'display', 'displayTracker', 'displayEmail', 'storeAuthorization',
    '$loading', 'parsePlayerDate', 'getLatestPlayerVersion', 'PLAYER_PRO_PRODUCT_CODE',
    function ($rootScope, $q, $state, $modal, display, displayTracker,
      displayEmail, storeAuthorization, $loading, parsePlayerDate,
      getLatestPlayerVersion, PLAYER_PRO_PRODUCT_CODE) {
      var factory = {};
      var _displayId;
      var _latestPlayerVersion;

      var _clearMessages = function () {
        factory.loadingDisplay = false;
        factory.savingDisplay = false;

        factory.errorMessage = '';
        factory.apiError = '';
      };

      var _init = function () {
        _displayId = undefined;

        factory.display = {
          'width': 1920,
          'height': 1080,
          'status': 1,
          'restartEnabled': true,
          'restartTime': '02:00',
          'monitoringEnabled': true,
          'useCompanyAddress': true
        };

        _clearMessages();
      };

      var _loadPlayerVersion = function () {
        getLatestPlayerVersion()
          .then(function (date) {
            _latestPlayerVersion = date;
          })
          .catch(function (err) {
            console.log('Error retrieving Player Version', err);
          });
      };

      _init();
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
        var minimumVersion = _latestPlayerVersion && 
          new Date(_latestPlayerVersion).setMonth(_latestPlayerVersion.getMonth() - 3);
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


      factory.addDisplayModal = function (display) {
        displayTracker('Add Display');

        _init();

        if (display) {
          factory.display = display;
        }

        $modal.open({
          templateUrl: 'partials/displays/display-add-modal.html',
          size: 'md',
          controller: 'displayAddModal',
          resolve: {
            downloadOnly: function () {
              return display || false;
            }
          }
        });
      };

      factory.getDisplay = function (displayId) {
        var deferred = $q.defer();

        _clearMessages();
        //load the display based on the url param
        _displayId = displayId;

        //show loading spinner
        factory.loadingDisplay = true;

        display.get(_displayId)
          .then(function (result) {
            factory.display = result.item;

            if (factory.display) {
              factory.showBrowserUpgradeMode = factory.display.browserUpgradeMode !==
                0;
            }

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('Get', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingDisplay = false;
          });

        return deferred.promise;
      };

      factory.addDisplay = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingDisplay = true;
        factory.savingDisplay = true;

        display.add(factory.display)
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              factory.display = resp.item;

              displayTracker('Display Created', resp.item.id, resp.item
                .name);

              displayEmail.send(resp.item.id, resp.item.name);

              $rootScope.$broadcast('displayCreated', resp.item);

              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          .then(null, function (e) {
            _showErrorMessage('Add', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingDisplay = false;
            factory.savingDisplay = false;
          });

        return deferred.promise;
      };

      factory.updateDisplay = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingDisplay = true;
        factory.savingDisplay = true;

        display.update(_displayId, factory.display)
          .then(function (displayId) {
            displayTracker('Display Updated', _displayId,
              factory.display.name);

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('Update', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingDisplay = false;
            factory.savingDisplay = false;
          });

        return deferred.promise;
      };

      factory.deleteDisplay = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingDisplay = true;

        display.delete(_displayId)
          .then(function () {
            displayTracker('Display Deleted', _displayId,
              factory.display.name);

            factory.display = {};

            $state.go('apps.displays.list');
          })
          .then(null, function (e) {
            _showErrorMessage('Delete', e);
          })
          .finally(function () {
            factory.loadingDisplay = false;
          });
      };

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + ' Display.';
        factory.apiError = e.result && e.result.error.message ?
          e.result.error.message : e.toString();
      };

      return factory;
    }
  ]);
