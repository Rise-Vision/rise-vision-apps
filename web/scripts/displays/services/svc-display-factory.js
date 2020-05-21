'use strict';

angular.module('risevision.displays.services')
  .factory('displayFactory', ['$rootScope', '$q', '$state', '$modal', '$loading', '$log',
    'userState', 'display', 'displayTracker', 'playerLicenseFactory', 'processErrorCode', 'storeService',
    'humanReadableError', 'plansFactory',
    function ($rootScope, $q, $state, $modal, $loading, $log, userState, display, displayTracker,
      playerLicenseFactory, processErrorCode, storeService, humanReadableError, plansFactory) {
      var factory = {};
      var _displayId;

      var _clearMessages = function () {
        factory.loadingDisplay = false;
        factory.savingDisplay = false;

        factory.errorMessage = '';
        factory.apiError = '';
      };

      factory.init = function () {
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

      factory.init();

      factory.addDisplayModal = function (display) {
        displayTracker('Add Display');

        if (display) {
          factory.display = display;
        } else {
          factory.init();
        }

        $modal.open({
          templateUrl: 'partials/displays/display-add-modal.html',
          size: 'lg',
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

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('get', e);

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

              playerLicenseFactory.toggleDisplayLicenseLocal(true);

              displayTracker('Display Created', resp.item.id, resp.item
                .name);

              $rootScope.$broadcast('displayCreated', resp.item);

              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          .then(null, function (e) {
            _showErrorMessage('add', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingDisplay = false;
            factory.savingDisplay = false;
          });

        return deferred.promise;
      };

      var _validateAddress = function () {
        if (factory.display.useCompanyAddress ||
          (factory.display.country !== '' &&
            factory.display.country !== 'CA' &&
            factory.display.country !== 'US')) {
          return $q.resolve();
        } else {
          return storeService.validateAddress(factory.display);
        }
      };

      factory.updateDisplay = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingDisplay = true;
        factory.savingDisplay = true;

        _validateAddress().then(function () {
            return display.update(_displayId, factory.display)
              .then(function (displayId) {
                displayTracker('Display Updated', _displayId,
                  factory.display.name);

                deferred.resolve();
              })
              .then(null, function (e) {
                _showErrorMessage('update', e);
                deferred.reject();
              });
          })
          .catch(function (e) {
            factory.errorMessage = 'We couldn\'t update your address.';
            factory.apiError = humanReadableError(e);
            $log.error(factory.errorMessage, e);
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

            if (factory.display.playerProAssigned) {
              playerLicenseFactory.toggleDisplayLicenseLocal(false);
            }
            factory.display = {};

            $state.go('apps.displays.list');
          })
          .then(null, function (e) {
            _showErrorMessage('delete', e);
          })
          .finally(function () {
            factory.loadingDisplay = false;
          });
      };

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + ' Display.';
        factory.apiError = processErrorCode('Display', action, e);

        $log.error(factory.errorMessage, e);
      };

      factory.showLicenseRequired = function (display) {
        return display && !display.playerProAuthorized && !userState.isRiseVisionUser();
      };

      factory.showLicenseUpdate = function() {
        if (playerLicenseFactory.getProLicenseCount() > 0) {
          $state.go('apps.billing.home');
        } else {
          plansFactory.showPlansModal();
        }
      };

      factory.showUnlockThisFeatureModal = function () {
        if (!factory.display || factory.display.playerProAuthorized) {
          return false;

        } else {
          $modal.open({
            templateUrl: 'partials/displays/unlock-display-feature-modal.html',
            controller: 'confirmModalController',
            windowClass: 'madero-style centered-modal unlock-this-feature-modal',
            size: 'sm',
            resolve: {
              confirmationTitle: null,
              confirmationMessage: null,
              confirmationButton: null,
              cancelButton: null
            }
          }).result.then(function () {
            factory.showLicenseUpdate();
          });

          return true;
        }
      };

      return factory;
    }
  ]);
