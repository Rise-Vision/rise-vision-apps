'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$q',
    'displayFactory', 'display', 'screenshotFactory', '$loading', '$log', 'confirmModal',
    'displayId', 'playerLicenseFactory', '$state',
    function ($scope, $q, displayFactory, display, screenshotFactory,
      $loading, $log, confirmModal, displayId, playerLicenseFactory, $state) {
      $scope.factory = displayFactory;
      $scope.playerLicenseFactory = playerLicenseFactory;
      $scope.selectedSchedule = null;

      displayFactory.getDisplay(displayId).then(function () {
        if (display.hasSchedule(displayFactory.display)) {
          $scope.selectedSchedule = {
            id: displayFactory.display.scheduleId,
            name: displayFactory.display.scheduleName,
            companyId: displayFactory.display.companyId
          };
        }

        if (!displayFactory.display.playerProAuthorized) {
          displayFactory.display.monitoringEnabled = false;
        }

        screenshotFactory.loadScreenshot();
      });

      $scope.$watch('factory.loadingDisplay', function (loading) {
        if (loading) {
          $loading.start('display-loader');
        } else {
          $loading.stop('display-loader');
        }
      });

      $scope.confirmDelete = function () {
        confirmModal('displays-app.details.deleteTitle',
          'displays-app.details.deleteWarning',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
          .then(displayFactory.deleteDisplay);
      };

      $scope.addDisplay = function () {
        if (!$scope.displayDetails.$dirty) {
          $state.go('apps.displays.add');
        } else {
          confirmModal('displays-app.details.unsavedTitle',
            'displays-app.details.unsavedWarning',
            'Yes', 'No', 'madero-style centered-modal',
            'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
            .then(function () {
              // do what you need if user presses ok
              $scope.save()
                .then(function () {
                  $state.go('apps.displays.add');
                });
            }, function (value) {
              // do what you need to do if user cancels
              if (value) {
                $state.go('apps.displays.add');
              }
            });

        }
      };

      $scope.save = function () {
        if (!$scope.displayDetails.$valid) {
          $log.info('form not valid: ', $scope.displayDetails.$error);

          return $q.reject();
        } else {
          return displayFactory.updateDisplay($scope.selectedSchedule);
        }
      };

    }
  ]);
