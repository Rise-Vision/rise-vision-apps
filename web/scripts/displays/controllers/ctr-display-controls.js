'use strict';

// controls Restart/Reboot functionality
angular.module('risevision.displays.controllers')
  .controller('displayControls', ['$scope', 'display',
    '$log', '$modal', '$templateCache', 'displayTracker',
    function ($scope, display, $log, $modal, $templateCache, displayTracker) {
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
            $scope.controlsError = e.message ? e.message : e.toString();
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
            $scope.controlsError = e.message ? e.message : e.toString();
          });
      };

      $scope.confirm = function (displayId, displayName, mode) {
        $scope.modalInstance = $modal.open({
          template: $templateCache.get(
            'confirm-instance/confirm-modal.html'),
          controller: 'confirmInstance',
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
