'use strict';

// controls Restart/Reboot functionality
angular.module('risevision.displays.controllers')
  .controller('displayControls', ['$scope', 'display', '$log', 'confirmModal', 
    'processErrorCode', 'displayTracker', 'displayFactory',
    function ($scope, display, $log, confirmModal, processErrorCode, displayTracker,
      displayFactory) {
      $scope.displayTracker = displayTracker;

      var _restart = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        $scope.controlsError = '';

        display.restart(displayId)
          .then(function (resp) {
            displayTracker('Display Restarted', displayId, displayName);
          })
          .then(null, function (e) {
            $scope.controlsError = processErrorCode('Display', 'restart', e);
          });
      };

      var _reboot = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        $scope.controlsError = '';

        display.reboot(displayId)
          .then(function (resp) {
            displayTracker('Display Rebooted', displayId, displayName);
          })
          .then(null, function (e) {
            $scope.controlsError = processErrorCode('Display', 'reboot', e);
          });
      };

      $scope.confirm = function (displayId, displayName, mode) {
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
    }
  ]);
