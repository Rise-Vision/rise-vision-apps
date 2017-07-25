'use strict';

angular.module('risevision.displays.controllers')
  .value('PLAYER_PRO_PRODUCT_CODE','c4b368be86245bf9501baaa6e0b00df9719869fd')
  .value('PLAYER_PRO_PRODUCT_ID', '2048')
  // .value('PLAYER_PRO_PRODUCT_LINK', 'https://www.risevision.com/pricing?utm_campaign=apps')
  .controller('displayDetails', ['$scope', '$q', '$state',
    'displayFactory', 'display', '$loading', '$log', '$modal',
    '$templateCache', '$filter', 'displayId', 'PLAYER_PRO_PRODUCT_CODE', 'PLAYER_PRO_PRODUCT_ID', '$rootScope', 'storeAuthorization', 'userState',
    function ($scope, $q, $state, displayFactory, display, $loading, $log,
      $modal, $templateCache, $filter, displayId, PLAYER_PRO_PRODUCT_CODE, PLAYER_PRO_PRODUCT_ID, $rootScope, storeAuthorization, userState) {
      $scope.factory = displayFactory;
      $scope.displayService = display;
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.productCode = PLAYER_PRO_PRODUCT_CODE;
      $scope.productId = PLAYER_PRO_PRODUCT_ID;
      // $scope.productLink = PLAYER_PRO_PRODUCT_LINK;
      $scope.subscriptionStatus = {};
      $scope.showTrialButton = false;
      $scope.showTrialStatus = false;
      $scope.showSubscribeButton = false;

      displayFactory.getDisplay(displayId).then(function () {
        $scope.display = displayFactory.display;

        $scope.loadScreenshot();
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

      $scope.requestScreenshot = function () {
        display.screenshotLoading = true;

        return display.requestScreenshot(displayId)
          .then($scope.loadScreenshot)
          .catch(function (err) {
            display.screenshotLoading = false;

            $scope.screenshot = {
              error: 'requesting'
            };
            console.log('Error requesting screenshot', err);
          });
      };

      $scope.loadScreenshot = function () {
        display.screenshotLoading = true;

        return display.loadScreenshot(displayId)
          .then(function (resp) {
            display.screenshotLoading = false;
            $scope.screenshot = resp;
          })
          .catch(function (err) {
            display.screenshotLoading = false;
            $scope.screenshot = {
              error: 'loading'
            };
            console.log('Error loading screenshot', err);
          });
      };

      $scope.screenshotState = function (display) {
        var statusFilter = $filter('status');

        if (!display || $scope.displayService.statusLoading || $scope.displayService
          .screenshotLoading) {
          return 'loading';
        } else if (display.os && display.os.indexOf('cros') === 0) {
          return 'os-not-supported';
        } else if (statusFilter(display) === 'notinstalled') {
          return 'not-installed';
        } else if (display.playerName !== 'RisePlayerElectron' || display.playerVersion <=
          '2017.01.10.17.33') {
          return 'upgrade-player';
        } else if (!$scope.displayService.hasSchedule(display)) {
          return 'no-schedule';
        } else if (statusFilter(display) === 'offline' && $scope.screenshot &&
          $scope.screenshot.lastModified) {
          return 'offline-screenshot-loaded';
        } else if (statusFilter(display) === 'offline') {
          return 'offline';
        } else if ($scope.screenshot && $scope.screenshot.lastModified) {
          return 'screenshot-loaded';
        } else if ($scope.screenshot && ($scope.screenshot.status === 404 ||
            $scope.screenshot.status === 403)) {
          return 'no-screenshot-available';
        } else if ($scope.screenshot && $scope.screenshot.error) {
          return 'screenshot-error';
        }

        return '';
      };

      $scope.reloadScreenshotDisabled = function (display) {
        return $scope.displayService.statusLoading ||
          $scope.displayService.screenshotLoading || [
            'no-screenshot-available', 'screenshot-loaded'
          ].indexOf($scope.screenshotState(display)) === -1;
      };

      $scope.startPlayerProTrial = function() {
        $loading.start('loading-trial');
        storeAuthorization.startTrial(PLAYER_PRO_PRODUCT_CODE)
        .then(function() {
          $scope.showTrialButton = false;
          $scope.showTrialStatus = true;
          $scope.showSubscribeButton = true;
          $rootScope.$emit('refreshSubscriptionStatus',$scope.subscriptionStatus.statusCode);
          $loading.stop('loading-trial');
        })
        .catch(function(e) {
          $loading.stop('loading-trial');
        });
      };

      var subscriptionStatusListener = $rootScope.$on('subscription-status:changed',
        function (e, subscriptionStatus) {
          $scope.subscriptionStatus = subscriptionStatus;

          $scope.showTrialButton = false;
          $scope.showTrialStatus = false;
          $scope.showSubscribeButton = false;
          switch (subscriptionStatus.statusCode) {
            case 'trial-available' :
              $scope.showTrialButton = true;
              break;
            case 'on-trial':
            case 'suspended':
              $scope.showTrialStatus = true;
              $scope.showSubscribeButton = true;
              break;
            case 'trial-expired':
            case 'cancelled':
            case 'not-subscribed': 
              $scope.showSubscribeButton = true;
              break;
            default:
              break;
          }          
        });

      $scope.$on('$destroy', function () {
        subscriptionStatusListener();
      });

      $scope.$watch('display.browserUpgradeMode', function () {
        if ($scope.display && $scope.display.browserUpgradeMode !== 0) {
          $scope.display.browserUpgradeMode = 1;
        }
      });
    }
  ]);
