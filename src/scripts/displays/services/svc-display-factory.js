'use strict';

angular.module('risevision.displays.services')
  .factory('displayFactory', ['$rootScope', '$q', '$state', '$log',
    'userState', 'display', 'displayTracker', 'scheduleFactory', 'playerLicenseFactory',
    'processErrorCode',
    function ($rootScope, $q, $state, $log, userState, display, displayTracker,
      scheduleFactory, playerLicenseFactory, processErrorCode) {
      var factory = {};

      var _clearMessages = function () {
        factory.loadingDisplay = false;
        factory.savingDisplay = false;

        factory.apiError = '';
      };

      factory.init = function () {
        factory.display = {
          'name': 'New Display',
          'width': 1920,
          'height': 1080,
          'status': 1,
          'restartEnabled': true,
          'restartTime': '02:00',
          'monitoringEnabled': true,
          'useCompanyAddress': true,
          'playerProAssigned': false,
          'playerProAuthorized': false
        };

        _clearMessages();
      };

      factory.init();

      factory.newDisplay = function () {
        displayTracker('Add Display');

        factory.init();

        if (playerLicenseFactory.isProAvailable(factory.display)) {
          factory.display.playerProAssigned = true;
          factory.display.playerProAuthorized = true;
        }
      };

      factory.getDisplay = function (displayId) {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingDisplay = true;

        display.get(displayId)
          .then(function (result) {
            factory.display = result.item;
            factory.display.originalPlayerProAuthorized = factory.display.playerProAuthorized;

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
              if (factory.display.playerProAuthorized) {
                playerLicenseFactory.toggleDisplayLicenseLocal(true);
              }

              displayTracker('Display Created', resp.item.id, resp.item
                .name);

              $rootScope.$broadcast('displayCreated', resp.item);

              return scheduleFactory.addToDistribution(resp.item, selectedSchedule)
                .then(function () {
                  if ($state.current.name === 'apps.displays.add') {
                    $state.go('apps.displays.details', {
                      displayId: resp.item.id
                    });
                  }

                  deferred.resolve();
                })
                .catch(function () {
                  factory.apiError = scheduleFactory.apiError;
                  deferred.reject();
                });
            } else {
              return $q.reject();
            }
          }, function (e) {
            _showErrorMessage('add', e);
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

        _update(factory.display.id, factory.display)
          .then(_updateLicenseIfNeeded)
          .then(function () {
            return scheduleFactory.addToDistribution(factory.display, selectedSchedule)
              .catch(function () {
                factory.apiError = scheduleFactory.apiError;
                deferred.reject();
              });
          })
          .catch(function (e) {
            _showErrorMessage('update', e);
            deferred.reject();
          })
          .finally(function () {
            factory.loadingDisplay = false;
            factory.savingDisplay = false;
          });

        return deferred.promise;
      };

      var _update = function (displayId, fields) {
        return display.update(displayId, fields).then(function (result) {
          displayTracker('Display Updated', displayId, fields && fields.name);
          return result;
        });
      };

      var _updateLicenseIfNeeded = function() {
        if (factory.display.playerProAuthorized !== factory.display.originalPlayerProAuthorized) {
          return playerLicenseFactory.updateDisplayLicense(factory.display)
            .then(function() {
              factory.display.originalPlayerProAuthorized = factory.display.playerProAuthorized;
            })
            .catch(function(err) {
              factory.apiError = playerLicenseFactory.apiError;
              return $q.reject(err);
            });
        } else {
          return $q.resolve();
        }
      };

      factory.applyFields = function (display, fields) {
        return _update(display.id, fields).then(function (result) {
          angular.extend(display, fields);
          return result;
        });
      };

      factory.deleteDisplayByObject = function (displayObject) {
        return display.delete(displayObject.id)
          .then(function () {
            displayTracker('Display Deleted', displayObject.id, displayObject.name);

            if (displayObject.playerProAssigned) {
              playerLicenseFactory.toggleDisplayLicenseLocal(false);
            }
          });
      };

      factory.deleteDisplay = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingDisplay = true;

        factory.deleteDisplayByObject(factory.display)
          .then(function () {
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
        display = display || factory.display;

        return display && !display.playerProAuthorized && !userState.isRiseAdmin();
      };

      return factory;
    }
  ]);
