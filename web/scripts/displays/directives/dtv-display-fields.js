'use strict';

angular.module('risevision.displays.directives')
  .directive('displayFields', ['$sce', 'userState', 'display', 'playerLicenseFactory', 'playerProFactory', 
    'displayControlFactory', 'playerActionsFactory', 'scheduleFactory', 'enableCompanyProduct', 'plansFactory',
    'processErrorCode', 'messageBox', 'confirmModal',
    'COUNTRIES', 'REGIONS_CA', 'REGIONS_US', 'TIMEZONES', 'SHARED_SCHEDULE_URL', 'PLAYER_PRO_PRODUCT_CODE',
    function ($sce, userState, display, playerLicenseFactory, playerProFactory, displayControlFactory,
      playerActionsFactory, scheduleFactory, enableCompanyProduct, plansFactory, 
      processErrorCode, messageBox, confirmModal,
      COUNTRIES, REGIONS_CA, REGIONS_US, TIMEZONES, SHARED_SCHEDULE_URL, PLAYER_PRO_PRODUCT_CODE) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-fields.html',
        link: function ($scope) {
          $scope.userState = userState;
          $scope.countries = COUNTRIES;
          $scope.regionsCA = REGIONS_CA;
          $scope.regionsUS = REGIONS_US;
          $scope.timezones = TIMEZONES;

          $scope.displayService = display;
          $scope.playerProFactory = playerProFactory;
          $scope.playerActionsFactory = playerActionsFactory;

          $scope.selectedSchedule = null;
          $scope.updatingRPP = false;

          var _updateDisplayLicenseLocal = function() {
            var playerProAuthorized = !$scope.display.playerProAuthorized;
            var company = userState.getCopyOfSelectedCompany(true);

            $scope.display.playerProAssigned = playerProAuthorized;
            $scope.display.playerProAuthorized = company.playerProAvailableLicenseCount > 0 &&
              playerProAuthorized;

            playerLicenseFactory.toggleDisplayLicenseLocal(playerProAuthorized);
          };

          var _updateDisplayLicense = function() {
            var apiParams = {};
            var playerProAuthorized = !$scope.display.playerProAuthorized;

            $scope.errorUpdatingRPP = false;
            $scope.updatingRPP = true;
            apiParams[$scope.display.id] = playerProAuthorized;

            enableCompanyProduct($scope.display.companyId, PLAYER_PRO_PRODUCT_CODE, apiParams)
              .then(function () {
                _updateDisplayLicenseLocal();
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
          };

          $scope.toggleProAuthorized = function () {
            if (!playerLicenseFactory.isProAvailable(displayFactory.display)) {
              $scope.display.playerProAuthorized = false;
              plansFactory.confirmAndPurchase();
            } else {
              if ($scope.display.id) {
                _updateDisplayLicense();
              } else {
                _updateDisplayLicenseLocal();
              }
            }
          };

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

          $scope.isChromeOs = function (display) {
            return display && display.os && (display.os.indexOf('cros') !==
              -1 && display.os.indexOf('icrosoft') === -1);
          };

          $scope.canReboot = function (display) {
            // Cannot reboot Linux/Windows/Mac PackagedApp players
            return ($scope.isChromeOs(display) || display.playerName !==
              'RisePlayerPackagedApp');
          };

          $scope.getEmbedUrl = function (scheduleId) {
            if (!scheduleId) {
              return null;
            }

            var url = SHARED_SCHEDULE_URL.replace('SCHEDULE_ID', scheduleId) +
              '&env=apps_display';

            return $sce.trustAsResourceUrl(url);
          };

          $scope.openTimePicker = function ($event, picker) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[picker] = !$scope[picker];
          };

          $scope.configureDisplayControl = function (display) {
            if (playerProFactory.isDisplayControlCompatiblePlayer(display)) {
              displayControlFactory.openDisplayControlModal();
            } else {
              $scope.displayControlError = true;
            }
          };

          $scope.installationInstructionsModal = function () {
            messageBox(null, null, null, 'madero-style centered-modal download-player-modal', 'partials/displays/download-player-modal.html', 'sm');
          };

          $scope.$on('risevision.company.updated', function () {
            var company = userState.getCopyOfSelectedCompany(true);

            $scope.display.playerProAuthorized = $scope.display.playerProAuthorized ||
              company.playerProAvailableLicenseCount > 0 && $scope.display.playerProAssigned;
          });

        } //link()
      };
    }
  ]);
