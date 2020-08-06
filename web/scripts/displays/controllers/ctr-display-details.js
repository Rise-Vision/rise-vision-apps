'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$rootScope', '$q',
    'displayFactory', 'display', 'screenshotFactory', 'playerProFactory', '$loading', '$log', '$modal',
    '$templateCache', 'displayId', 'enableCompanyProduct', 'userState', 'plansFactory',
    'currentPlanFactory', 'playerLicenseFactory', 'PLAYER_PRO_PRODUCT_CODE', '$state', 'addressService', 'scheduleFactory',
    function ($scope, $rootScope, $q, displayFactory, display, screenshotFactory, playerProFactory,
      $loading, $log, $modal, $templateCache, displayId, enableCompanyProduct, userState,
      plansFactory, currentPlanFactory, playerLicenseFactory, PLAYER_PRO_PRODUCT_CODE, $state, addressService, scheduleFactory) {
      $scope.displayId = displayId;
      $scope.factory = displayFactory;
      $scope.displayService = display;
      $scope.playerProFactory = playerProFactory;
      $scope.currentPlanFactory = currentPlanFactory;
      $scope.updatingRPP = false;
      $scope.monitoringSchedule = {};
      $scope.showPlansModal = plansFactory.showPlansModal;
      $scope.selectedSchedule = null;

      displayFactory.getDisplay(displayId).then(function () {
        $scope.display = displayFactory.display;

        $scope.selectedSchedule = {
          id: $scope.display.scheduleId,
          name: $scope.display.scheduleName,
          companyId: $scope.display.companyId
        };

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

      $scope.onScheduleChanged = function(newSchedule) {
        console.log('onScheduleChanged',newSchedule);
        $scope.selectedSchedule = newSchedule;
      };

      $scope.toggleProAuthorized = function () {
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

      $scope.isProSupported = function () {
        var unsupported = playerProFactory.isUnsupportedPlayer($scope.display);

        return !unsupported;
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
          return displayFactory.updateDisplay( shouldSkipAddressValidation ).then(_saveSchedule);
        }
      };

      var _saveSchedule = function() {
        if ($scope.selectedSchedule.id === $scope.display.scheduleId) {
          $log.info('Assigned Schedule has not changed.', $scope.selectedSchedule.id);
          return $q.resolve();
        } else {
          $log.info('Updating assigned Schedule.', $scope.selectedSchedule.id);
          //add to distribution if not added yet - previous request may have failed.
          $scope.selectedSchedule.distribution = $scope.selectedSchedule.distribution? $scope.selectedSchedule.distribution: [];
          if ($scope.selectedSchedule.distribution.indexOf($scope.display.id) === -1) {
            $scope.selectedSchedule.distribution.push($scope.display.id);
          }
          $log.info('Assigned Schedule distribution.', $scope.selectedSchedule.distribution);
          scheduleFactory.setSchedule($scope.selectedSchedule);
          return scheduleFactory.updateSchedule().then(function() {
            $scope.display.scheduleId = $scope.selectedSchedule.id;
            $scope.display.scheduleName = $scope.selectedSchedule.name;
          });
        }
      }

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
