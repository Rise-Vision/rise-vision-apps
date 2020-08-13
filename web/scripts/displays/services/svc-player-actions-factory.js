'use strict';

angular.module('risevision.displays.services')
  .factory('playerActionsFactory', ['display', 'confirmModal',  'processErrorCode', 
  'displayTracker', 'displayFactory',
    function (display, confirmModal, processErrorCode, displayTracker,
      displayFactory) {
      var service = {};

      var _restart = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        service.controlsError = '';

        display.restart(displayId)
          .then(function (resp) {
            displayTracker('Display Restarted', displayId, displayName);
          })
          .then(null, function (e) {
            service.controlsError = processErrorCode(e);
          });
      };

      var _reboot = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        service.controlsError = '';

        display.reboot(displayId)
          .then(function (resp) {
            displayTracker('Display Rebooted', displayId, displayName);
          })
          .then(null, function (e) {
            service.controlsError = processErrorCode(e);
          });
      };

      service.confirm = function (displayId, displayName, mode) {
        if (displayFactory.showUnlockDisplayFeatureModal()) {
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
          if (mode === 'reboot') {
            _reboot(displayId, displayName);
          } else if (mode === 'restart') {
            _restart(displayId, displayName);
          }
        }, function () {
          // do what you need to do if user cancels
        });
      };

      return service;
    }
  ]);
