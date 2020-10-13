'use strict';

angular.module('risevision.displays.services')
  .factory('playerActionsFactory', ['display', 'confirmModal', 'processErrorCode',
    'displayTracker', 'displayFactory',
    function (display, confirmModal, processErrorCode, displayTracker,
      displayFactory) {
      var service = {};

      var _restart = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        return display.restart(displayId)
          .then(function (resp) {
            displayTracker('Display Restarted', displayId, displayName);
          });
      };

      var _reboot = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        return display.reboot(displayId)
          .then(function (resp) {
            displayTracker('Display Rebooted', displayId, displayName);
          });
      };

      service.restartByObject = function(display) {
        return _restart(display.id, display.name);
      };

      service.rebootByObject = function(display) {
        return _reboot(display.id, display.name);
      };

      service.confirm = function (displayId, displayName, mode) {
        if (displayFactory.showLicenseRequired()) {
          return;
        }

        confirmModal(
          'displays-app.fields.controls.' + mode + '.title',
          'displays-app.fields.controls.' + mode + '.warning',
          'Yes',
          'No',
          'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html',
          'sm'
        ).then(function () {
          // do what you need if user presses ok
          service.controlsError = '';

          if (mode === 'reboot') {
            _reboot(displayId, displayName).catch(function (e) {
              service.controlsError = processErrorCode(e);
            });
          } else if (mode === 'restart') {
            _restart(displayId, displayName).catch(function (e) {
              service.controlsError = processErrorCode(e);
            });
          }
        }, function () {
          // do what you need to do if user cancels
        });
      };

      return service;
    }
  ]);
