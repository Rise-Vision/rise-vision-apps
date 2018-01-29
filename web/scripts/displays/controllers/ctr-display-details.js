'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$rootScope', '$q', '$state',
    'displayFactory', 'display', 'screenshotFactory', 'playerProFactory', '$loading', '$log', '$modal',
    '$templateCache', 'displayId', 'storeAuthorization', 'userState',
    'PLAYER_PRO_PRODUCT_CODE', 'PLAYER_PRO_PRODUCT_ID',
    function ($scope, $rootScope, $q, $state, displayFactory, display, screenshotFactory, playerProFactory,
      $loading, $log, $modal, $templateCache, displayId, storeAuthorization, userState,
      PLAYER_PRO_PRODUCT_CODE, PLAYER_PRO_PRODUCT_ID) {
      $scope.displayId = displayId;
      $scope.factory = displayFactory;
      $scope.displayService = display;
      $scope.playerProFactory = playerProFactory;
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.productCode = PLAYER_PRO_PRODUCT_CODE;
      $scope.productId = PLAYER_PRO_PRODUCT_ID;
      $scope.deferredDisplay = $q.defer();

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

      var refreshSubscriptionStatusListener = $rootScope.$on('refreshSubscriptionStatus', function () {
        $loading.start('loading-trial');
      });

      var subscriptionStatusListener = $rootScope.$on('subscription-status:changed',
        function (e, subscriptionStatus) {
          $loading.stop('loading-trial');
          $scope.deferredDisplay.promise
            .then(function () {
              return $scope.displayService.getCompanyProStatus($scope.companyId, true);
            })
            .then(function (companyProStatus) {
              if (companyProStatus.statusCode === 'subscribed' && subscriptionStatus.statusCode ===
                'trial-available') {
                subscriptionStatus.statusCode = 'not-subscribed';
              }

              $scope.display.subscriptionStatus = subscriptionStatus;

              $scope.display.showTrialButton = false;
              $scope.display.showTrialStatus = false;
              $scope.display.showSubscribeButton = false;

              if (!playerProFactory.is3rdPartyPlayer($scope.display) &&
                !playerProFactory.isOutdatedPlayer($scope.display)) {
                switch (subscriptionStatus.statusCode) {
                case 'trial-available':
                  $scope.display.showTrialButton = true;
                  break;
                case 'on-trial':
                case 'suspended':
                  $scope.display.showTrialStatus = true;
                  $scope.display.showSubscribeButton = true;
                  break;
                case 'trial-expired':
                case 'cancelled':
                case 'not-subscribed':
                  $scope.display.showSubscribeButton = true;
                  break;
                default:
                  break;
                }
              }
            });
        });

      $scope.$on('$destroy', function () {
        subscriptionStatusListener();
        refreshSubscriptionStatusListener();
      });

      $scope.$watch('display.browserUpgradeMode', function () {
        if ($scope.display && $scope.display.browserUpgradeMode !== 0) {
          $scope.display.browserUpgradeMode = 1;
        }
      });
    }
  ]);
