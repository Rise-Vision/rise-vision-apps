'use strict';

// controls Restart/Reboot functionality
angular.module('risevision.displays.controllers')
  .controller('displayControls', ['$scope', 'display',
    '$log', '$modal', '$templateCache', 'processErrorCode', 'displayTracker',
    'displayFactory',
    function ($scope, display, $log, $modal, $templateCache, processErrorCode,
      displayTracker, displayFactory) {
      $scope.displayTracker = displayTracker;

      var _restart = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        $scope.controlsInfo = '';
        $scope.controlsError = '';

        display.restart(displayId)
          .then(function (resp) {
            displayTracker('Display Restarted', displayId, displayName);

            $scope.controlsInfo =
              'displays-app.fields.controls.restart.success';
          })
          .then(null, function (e) {
            $scope.controlsError = processErrorCode('Display', 'restart', e);
          });
      };

      var _reboot = function (displayId, displayName) {
        if (!displayId) {
          return;
        }

        $scope.controlsInfo = '';
        $scope.controlsError = '';

        display.reboot(displayId)
          .then(function (resp) {
            displayTracker('Display Rebooted', displayId, displayName);

            $scope.controlsInfo =
              'displays-app.fields.controls.reboot.success';
          })
          .then(null, function (e) {
            $scope.controlsError = processErrorCode('Display', 'reboot', e);
          });
      };

      $scope.confirm = function (displayId, displayName, mode) {
        if (displayFactory.showUnlockDisplayFeatureModal()) {
          return;
        }

        $scope.modalInstance = $modal.open({
          template: $templateCache.get(
            'partials/components/confirm-modal/confirm-modal.html'),
          controller: 'confirmModalController',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'displays-app.fields.controls.' + mode +
                '.title';
            },
            confirmationMessage: function () {
              return 'displays-app.fields.controls.' + mode +
                '.warning';
            },
            confirmationButton: null,
            cancelButton: null
          }
        });

        $scope.modalInstance.result.then(function () {
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
