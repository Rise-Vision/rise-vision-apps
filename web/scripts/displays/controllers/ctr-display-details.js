'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$rootScope', '$q',
    'displayFactory', 'display', 'screenshotFactory', '$loading', '$log', '$modal',
    '$templateCache', 'displayId', 'enableCompanyProduct', 'userState', 'plansFactory',
    'playerLicenseFactory', 'PLAYER_PRO_PRODUCT_CODE',
    '$state', 'scheduleFactory', 'processErrorCode', 'confirmModal',
    function ($scope, $rootScope, $q, displayFactory, display, screenshotFactory,
      $loading, $log, $modal, $templateCache, displayId, enableCompanyProduct, userState,
      plansFactory, playerLicenseFactory,
      PLAYER_PRO_PRODUCT_CODE, $state, scheduleFactory, processErrorCode, confirmModal) {
      $scope.displayId = displayId;
      $scope.factory = displayFactory;
      $scope.displayService = display;
      $scope.playerLicenseFactory = playerLicenseFactory;
      $scope.updatingRPP = false;
      $scope.selectedSchedule = null;

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

      $scope.$watchGroup(['factory.loadingDisplay'], function (loading) {
        if (!$scope.factory.loadingDisplay) {
          $loading.stop('display-loader');
        } else {
          $loading.start('display-loader');
        }
      });

      $scope.$watch('selectedSchedule', function (newSchedule, oldSchedule) {
        var isChangingSchedule = oldSchedule || (!oldSchedule && !display.hasSchedule($scope.display));
        if (isChangingSchedule && scheduleFactory.requiresLicense(newSchedule) && !$scope.display.playerProAuthorized) {
          confirmModal('Assign license?',
            'You\'ve selected a schedule that contains presentations. In order to show this schedule on this display, you need to license it. Assign license now?',
            'Yes', 'No', 'madero-style centered-modal',
            'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
          .then(function() {
              $scope.toggleProAuthorized();
          });
        }
      });

      $scope.confirmLicensing = function() {
        return confirmModal('Assign license?',
          'Do you want to assign one of your licenses to this display?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
        .then(function() {
          $scope.toggleProAuthorized();
        });
      };

      $scope.toggleProAuthorized = function () {
        $scope.errorUpdatingRPP = false;

        if (!playerLicenseFactory.isProAvailable()) {
          $scope.display.playerProAuthorized = false;
          plansFactory.confirmAndPurchase();
        } else {
          var apiParams = {};
          var playerProAuthorized = !$scope.display.playerProAuthorized;

          $scope.updatingRPP = true;
          apiParams[displayId] = playerProAuthorized;

          enableCompanyProduct($scope.display.companyId, PLAYER_PRO_PRODUCT_CODE, apiParams)
            .then(function () {
              var company = userState.getCopyOfSelectedCompany(true);

              $scope.display.playerProAssigned = playerProAuthorized;
              $scope.display.playerProAuthorized = company.playerProAvailableLicenseCount > 0 &&
                playerProAuthorized;

              playerLicenseFactory.toggleDisplayLicenseLocal(playerProAuthorized);
            })
            .catch(function (err) {
              $scope.errorUpdatingRPP = processErrorCode(err);

              $scope.display.playerProAuthorized = !playerProAuthorized;
            })
            .finally(function () {
              if (!playerProAuthorized) {
                $scope.display.monitoringEnabled = false;
              }

              $scope.updatingRPP = false;
            });
        }
      };

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

      var startTrialListener = $rootScope.$on('risevision.company.updated', function () {
        var company = userState.getCopyOfSelectedCompany(true);

        $scope.display.playerProAuthorized = $scope.display.playerProAuthorized ||
          company.playerProAvailableLicenseCount > 0 && $scope.display.playerProAssigned;
      });

      $scope.$on('$destroy', function () {
        startTrialListener();
      });

    }
  ]);
