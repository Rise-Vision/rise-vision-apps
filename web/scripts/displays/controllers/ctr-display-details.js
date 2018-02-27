'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$rootScope', '$q', '$state',
    'displayFactory', 'display', 'screenshotFactory', 'playerProFactory', '$loading', '$log', '$modal',
    '$templateCache', 'displayId', 'storeAuthorization', 'enableCompanyProduct', 'userState', 'planFactory',
    'PLAYER_PRO_PRODUCT_CODE', 'PLAYER_PRO_PRODUCT_ID',
    function ($scope, $rootScope, $q, $state, displayFactory, display, screenshotFactory, playerProFactory,
      $loading, $log, $modal, $templateCache, displayId, storeAuthorization, enableCompanyProduct, userState,
      planFactory, PLAYER_PRO_PRODUCT_CODE, PLAYER_PRO_PRODUCT_ID) {
      $scope.displayId = displayId;
      $scope.factory = displayFactory;
      $scope.displayService = display;
      $scope.playerProFactory = playerProFactory;
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.company = userState.getCopyOfSelectedCompany(true);
      $scope.deferredDisplay = $q.defer();
      $scope.updatingRPP = false;
      $scope.showPlansModal = planFactory.showPlansModal;

      displayFactory.getDisplay(displayId).then(function () {
        $scope.display = displayFactory.display;
        $scope.deferredDisplay.resolve();

        screenshotFactory.loadScreenshot();
      });

      $scope.$watch('factory.loadingDisplay', function (loading) {
        if (loading) {
          $loading.start('display-loader');
        } else {
          $loading.stop('display-loader');
        }
      });

      $scope.toggleProAuthorized = function () {
        if (!$scope.isProAvailable()) {
          $scope.display.playerProAuthorized = false;
          $scope.showPlansModal();
        } else {
          var apiParams = {};

          $scope.updatingRPP = true;
          apiParams[displayId] = $scope.display.playerProAuthorized;

          enableCompanyProduct($scope.display.companyId, PLAYER_PRO_PRODUCT_CODE, apiParams)
            .then(function () {
              var assignedDisplays = $scope.company.playerProAssignedDisplays || [];

              if ($scope.display.playerProAuthorized) {
                assignedDisplays.push(displayId);
              } else if (assignedDisplays.indexOf(displayId) >= 0) {
                assignedDisplays.splice(assignedDisplays.indexOf(displayId), 1);
              }

              $scope.company.playerProAssignedDisplays = assignedDisplays;
              userState.updateCompanySettings($scope.company);
            })
            .catch(function (err) {
              $scope.display.playerProAuthorized = !$scope.display.playerProAuthorized;
            })
            .finally(function () {
              $scope.updatingRPP = false;
            });
        }
      };

      $scope.getProLicenseCount = function () {
        return ($scope.company.planPlayerProLicenseCount || 0) + ($scope.company.playerProLicenseCount || 0);
      };

      $scope.areAllProLicensesUsed = function () {
        var maxProDisplays = $scope.getProLicenseCount();
        var assignedDisplays = $scope.company.playerProAssignedDisplays || [];
        var allLicensesUsed = assignedDisplays.length === maxProDisplays;
        var allProLicensesUsed = allLicensesUsed && assignedDisplays.indexOf($scope.displayId) === -1;

        return $scope.getProLicenseCount() > 0 && allProLicensesUsed;
      };

      $scope.isProAvailable = function () {
        return $scope.getProLicenseCount() > 0 && !$scope.areAllProLicensesUsed();
      };

      $scope.isProApplicable = function () {
        return !playerProFactory.is3rdPartyPlayer($scope.display) &&
               !playerProFactory.isUnsupportedPlayer($scope.display);
      };

      $scope.confirmDelete = function () {
        $scope.modalInstance = $modal.open({
          template: $templateCache.get(
            'confirm-instance/confirm-modal.html'),
          controller: 'confirmInstance',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'displays-app.details.deleteTitle';
            },
            confirmationMessage: function () {
              return 'displays-app.details.deleteWarning';
            },
            confirmationButton: function () {
              return 'common.delete-forever';
            },
            cancelButton: null
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
              'confirm-instance/confirm-modal.html'),
            controller: 'confirmInstance',
            windowClass: 'modal-custom',
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
          console.info('form not valid: ', $scope.displayDetails.$error);

          return $q.reject();
        } else {
          return displayFactory.updateDisplay();
        }
      };

      var startTrialListener = $rootScope.$on('risevision.company.updated', function () {
        $scope.company = userState.getCopyOfSelectedCompany(true);
      });

      $scope.$on('$destroy', function () {
        startTrialListener();
      });

      $scope.$watch('display.browserUpgradeMode', function () {
        if ($scope.display && $scope.display.browserUpgradeMode !== 0) {
          $scope.display.browserUpgradeMode = 1;
        }
      });
    }
  ]);
