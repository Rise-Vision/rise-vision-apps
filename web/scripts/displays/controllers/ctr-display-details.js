'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$q',
    'displayFactory', 'display', 'screenshotFactory', '$loading', '$log', '$modal',
    '$templateCache', 'displayId', 'playerLicenseFactory', '$state',
    function ($scope, $q, displayFactory, display, screenshotFactory,
      $loading, $log, $modal, $templateCache, displayId, playerLicenseFactory, $state) {
      $scope.displayId = displayId;
      $scope.factory = displayFactory;
      $scope.playerLicenseFactory = playerLicenseFactory;

      displayFactory.getDisplay(displayId).then(function () {
        $scope.display = displayFactory.display;

        if (display.hasSchedule($scope.display)) {
          $scope.selectedSchedule = {
            id: $scope.display.scheduleId,
            name: $scope.display.scheduleName,
            companyId: $scope.display.companyId
          };
        }

        if (!$scope.display.playerProAuthorized) {
          $scope.display.monitoringEnabled = false;
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
        $scope.modalInstance = $modal.open({
          template: $templateCache.get(
            'partials/components/confirm-modal/madero-confirm-modal.html'),
          controller: 'confirmModalController',
          windowClass: 'madero-style centered-modal',
          size: 'sm',
          resolve: {
            confirmationTitle: function () {
              return 'displays-app.details.deleteTitle';
            },
            confirmationMessage: function () {
              return 'displays-app.details.deleteWarning';
            },
            confirmationButton: function () {
              return 'Yes';
            },
            cancelButton: function () {
              return 'No';
            }
          }
        });

        $scope.modalInstance.result.then(displayFactory.deleteDisplay);
      };

      $scope.addDisplay = function () {
        if (!$scope.displayDetails.$dirty) {
          $state.go('apps.displays.add');
        } else {
          $scope.modalInstance = $modal.open({
            template: $templateCache.get(
              'partials/components/confirm-modal/madero-confirm-modal.html'),
            controller: 'confirmModalController',
            windowClass: 'madero-style centered-modal',
            size: 'sm',
            resolve: {
              confirmationTitle: function () {
                return 'displays-app.details.unsavedTitle';
              },
              confirmationMessage: function () {
                return 'displays-app.details.unsavedWarning';
              },
              confirmationButton: function () {
                return 'common.save';
              },
              cancelButton: function () {
                return 'common.discard';
              }
            }
          });

          $scope.modalInstance.result.then(function () {
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
