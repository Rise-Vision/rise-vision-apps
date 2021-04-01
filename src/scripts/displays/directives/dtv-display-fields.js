'use strict';

angular.module('risevision.displays.directives')
  .directive('displayFields', ['$sce', 'userState', 'display', 'displayFactory', 'playerLicenseFactory',
    'playerProFactory', 'displayControlFactory', 'playerActionsFactory', 'scheduleFactory',
    'plansFactory', 'messageBox', 'confirmModal', 'SHARED_SCHEDULE_URL',
    function ($sce, userState, display, displayFactory, playerLicenseFactory, playerProFactory,
      displayControlFactory, playerActionsFactory, scheduleFactory, plansFactory,
      messageBox, confirmModal, SHARED_SCHEDULE_URL) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-fields.html',
        link: function ($scope) {
          $scope.userState = userState;
          $scope.displayService = display;
          $scope.playerProFactory = playerProFactory;
          $scope.playerActionsFactory = playerActionsFactory;

          $scope.toggleProAuthorized = function () {
            if (!playerLicenseFactory.isProAvailable(displayFactory.display) && !displayFactory.display.originalPlayerProAuthorized) {
              displayFactory.display.playerProAuthorized = false;
              plansFactory.confirmAndPurchase();
            } else {
              playerLicenseFactory.updateDisplayLicenseLocal(displayFactory.display);
            }
          };

          $scope.scheduleSelected = function () {
            if (scheduleFactory.requiresLicense($scope.selectedSchedule) && !displayFactory.display
              .playerProAuthorized) {
              confirmModal('Assign license?',
                  'You\'ve selected a schedule that contains presentations. In order to show this schedule on this display, you need to license it. Assign license now?',
                  'Yes', 'No', 'madero-style centered-modal',
                  'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
                .then(function () {
                  // Toggle license as if they clicked the checkbox
                  displayFactory.display.playerProAuthorized = true;

                  $scope.toggleProAuthorized();
                });
            }
          };

          $scope.confirmLicensing = function () {
            return confirmModal('Assign license?',
                'Do you want to assign one of your licenses to this display?',
                'Yes', 'No', 'madero-style centered-modal',
                'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
              .then(function () {
                // Toggle license as if they clicked the checkbox
                displayFactory.display.playerProAuthorized = true;

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
            messageBox(null, null, null, 'madero-style centered-modal download-player-modal',
              'partials/displays/download-player-modal.html', 'sm');
          };

          $scope.$on('risevision.company.updated', function () {
            var company = userState.getCopyOfSelectedCompany(true);

            displayFactory.display.playerProAuthorized = displayFactory.display.playerProAuthorized ||
              company.playerProAvailableLicenseCount > 0 && displayFactory.display.playerProAssigned;
          });

        } //link()
      };
    }
  ]);
