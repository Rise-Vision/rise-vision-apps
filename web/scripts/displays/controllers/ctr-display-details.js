'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$rootScope', '$q',
    'displayFactory', 'display', 'screenshotFactory', 'playerProFactory', '$loading', '$log', '$modal',
    '$templateCache', 'displayId', 'enableCompanyProduct', 'userState', 'plansFactory',
    'currentPlanFactory', 'playerLicenseFactory', 'playerActionsFactory', 'PLAYER_PRO_PRODUCT_CODE', 
    '$state', 'addressService', 'scheduleFactory', 'processErrorCode',
    function ($scope, $rootScope, $q, displayFactory, display, screenshotFactory, playerProFactory,
      $loading, $log, $modal, $templateCache, displayId, enableCompanyProduct, userState,
      plansFactory, currentPlanFactory, playerLicenseFactory, playerActionsFactory, 
      PLAYER_PRO_PRODUCT_CODE, $state, addressService, scheduleFactory, processErrorCode) {
      $scope.displayId = displayId;
      $scope.factory = displayFactory;
      $scope.displayService = display;
      $scope.playerProFactory = playerProFactory;
      $scope.currentPlanFactory = currentPlanFactory;
      $scope.playerActionsFactory = playerActionsFactory;
      $scope.updatingRPP = false;
      $scope.monitoringSchedule = {};
      $scope.showPlansModal = plansFactory.showPlansModal;
      $scope.selectedSchedule = null;
      $scope.scheduleFactory = scheduleFactory;

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

      $scope.$watchGroup(['factory.loadingDisplay','scheduleFactory.savingSchedule'], function (loading) {
        if (!$scope.factory.loadingDisplay && !$scope.scheduleFactory.savingSchedule) {
          $loading.stop('display-loader');
        } else {
          $loading.start('display-loader');
        }
      });

      $scope.toggleProAuthorized = function () {
        $scope.errorUpdatingRPP = false;

        if (!$scope.isProAvailable()) {
          $scope.display.playerProAuthorized = false;
          if ($scope.getProLicenseCount() > 0 && $scope.areAllProLicensesUsed()) {
            $state.go('apps.billing.home');
          } else {
            plansFactory.showPlansModal();
          }
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
              $scope.errorUpdatingRPP = processErrorCode(null, null, err);

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

      $scope.getProLicenseCount = function () {
        return playerLicenseFactory.getProLicenseCount();
      };

      $scope.getProAvailableLicenseCount = function () {
        return playerLicenseFactory.getProAvailableLicenseCount();
      };

      $scope.getProUsedLicenseCount = function () {
        return playerLicenseFactory.getProUsedLicenseCount();
      };

      $scope.areAllProLicensesUsed = function () {
        var allLicensesUsed = playerLicenseFactory.areAllProLicensesUsed();
        var allProLicensesUsed = allLicensesUsed && !($scope.display && $scope.display.playerProAssigned);

        return $scope.getProLicenseCount() > 0 && allProLicensesUsed;
      };

      $scope.isProAvailable = function () {
        return playerLicenseFactory.hasProfessionalLicenses() && $scope.getProLicenseCount() > 0 && !$scope
          .areAllProLicensesUsed();
      };

      $scope.isProToggleEnabled = function () {
        return userState.hasRole('da') && (($scope.display && $scope.display.playerProAuthorized) ||
          ($scope.areAllProLicensesUsed() ? !currentPlanFactory.currentPlan.isPurchasedByParent : true));
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
          displayFactory.addDisplayModal();
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
                displayFactory.addDisplayModal();
              });
          }, function (value) {
            // do what you need to do if user cancels
            if (value) {
              displayFactory.addDisplayModal();
            }
          });
        }
      };

      $scope.save = function () {
        if (!$scope.displayDetails.$valid) {
          $log.info('form not valid: ', $scope.displayDetails.$error);

          return $q.reject();
        } else {
          var shouldSkipAddressValidation = !addressService.isAddressFormDirty($scope.displayDetails) && !$scope.displayDetails.useCompanyAddress.$dirty;
          return displayFactory.updateDisplay(shouldSkipAddressValidation).then(function() {
            scheduleFactory.addToDistribution($scope.display, $scope.selectedSchedule).catch(function() {
              displayFactory.errorMessage = scheduleFactory.errorMessage;
              displayFactory.apiError = scheduleFactory.apiError;
            });
          });
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
