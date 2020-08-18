'use strict';

angular.module('risevision.displays.services')
  .factory('displayFactory', ['$rootScope', '$q', '$state', '$modal', '$loading', '$log',
    'userState', 'display', 'displayTracker', 'scheduleFactory', 'playerLicenseFactory',
    'processErrorCode', 'plansFactory',
    function ($rootScope, $q, $state, $modal, $loading, $log, userState, display, displayTracker,
      scheduleFactory, playerLicenseFactory, processErrorCode, plansFactory) {
      var factory = {};
      var _displayId;

      var _clearMessages = function () {
        factory.loadingDisplay = false;
        factory.savingDisplay = false;

        factory.apiError = '';
      };

      factory.init = function () {
        _displayId = undefined;

        factory.display = {
          'name': 'New Display',
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

      factory.newDisplay = function () {
        displayTracker('Add Display');

        factory.init();
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

      factory.addDisplay = function (selectedSchedule) {
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

              return scheduleFactory.addToDistribution(factory.display, selectedSchedule);
            } else {
              return $q.reject();
            }
          }, function (e) {
            _showErrorMessage('add', e);
            deferred.reject();
          })
          .then(function() {
            deferred.resolve();
          })
          .catch(function () {
            displayFactory.apiError = scheduleFactory.apiError;
            deferred.reject();
          })
          .finally(function () {
            factory.loadingDisplay = false;
            factory.savingDisplay = false;
          });

        return deferred.promise;
      };

      factory.updateDisplay = function (selectedSchedule) {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingDisplay = true;
        factory.savingDisplay = true;

        display.update(_displayId, factory.display)
          .then(function (displayId) {
            displayTracker('Display Updated', _displayId,
              factory.display.name);

            return scheduleFactory.addToDistribution(factory.display, selectedSchedule);
          }, function (e) {
            _showErrorMessage('update', e);
            deferred.reject();
          })
          .then(function() {
            deferred.resolve();
          })
          .catch(function () {
            displayFactory.apiError = scheduleFactory.apiError;
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
        factory.apiError = processErrorCode(e);

        $log.error(factory.apiError, e);
      };

      factory.showLicenseRequired = function (display) {
        return display && !display.playerProAuthorized && !userState.isRiseAdmin();
      };

      factory.showLicenseUpdate = function () {
        if (playerLicenseFactory.getProLicenseCount() > 0) {
          $state.go('apps.billing.home');
        } else {
          plansFactory.showPlansModal();
        }
      };

      factory.showUnlockDisplayFeatureModal = function () {
        if (!factory.showLicenseRequired(factory.display)) {
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
