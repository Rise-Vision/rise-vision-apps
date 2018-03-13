'use strict';

angular.module('risevision.displays.controllers')
  .value('TL_EMAIL_DELIMITER', ',')
  .value('EMAIL_REGEX', /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
  .controller('displayDetails', ['$scope', '$rootScope', '$q', '$state', '$filter',
    'displayFactory', 'display', 'screenshotFactory', 'playerProFactory', '$loading', '$log', '$modal',
    '$templateCache', 'displayId', 'storeAuthorization', 'enableCompanyProduct', 'userState', 'planFactory',
    'PLAYER_PRO_PRODUCT_CODE', 'PLAYER_PRO_PRODUCT_ID', 'TL_EMAIL_DELIMITER', 'EMAIL_REGEX',
    function ($scope, $rootScope, $q, $state, $filter, displayFactory, display, screenshotFactory, playerProFactory,
      $loading, $log, $modal, $templateCache, displayId, storeAuthorization, enableCompanyProduct, userState,
      planFactory, PLAYER_PRO_PRODUCT_CODE, PLAYER_PRO_PRODUCT_ID, EMAIL_DELIMITER, EMAIL_REGEX) {
      $scope.displayId = displayId;
      $scope.factory = displayFactory;
      $scope.displayService = display;
      $scope.playerProFactory = playerProFactory;
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.company = userState.getCopyOfSelectedCompany(true);
      $scope.deferredDisplay = $q.defer();
      $scope.updatingRPP = false;
      $scope.monitoringEmailsList = [];
      $scope.monitoringSchedule = {};
      $scope.playlistItem = {};
      $scope.showPlansModal = planFactory.showPlansModal;

      displayFactory.getDisplay(displayId).then(function () {
        $scope.display = displayFactory.display;
        $scope.monitoringEmailsList = ($scope.display.monitoringEmails || []).map(function(e) { return { text: e }; });
        $scope.monitoringSchedule = _parseTimeline($scope.display.monitoringSchedule);

        if (!$scope.display.playerProAuthorized) {
          $scope.display.monitoringEnabled = false;
        }

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
          var playerProAuthorized = $scope.display.playerProAuthorized;

          $scope.updatingRPP = true;
          apiParams[displayId] = playerProAuthorized;

          enableCompanyProduct($scope.display.companyId, PLAYER_PRO_PRODUCT_CODE, apiParams)
            .then(function () {
              planFactory.toggleDisplayLicenseLocal(displayId, playerProAuthorized);
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
        return planFactory.getProLicenseCount($scope.company);
      };

      $scope.areAllProLicensesUsed = function () {
        var assignedDisplays = $scope.company.playerProAssignedDisplays || [];
        var allLicensesUsed = planFactory.areAllProLicensesUsed();
        var allProLicensesUsed = allLicensesUsed && assignedDisplays.indexOf($scope.displayId) === -1;

        return $scope.getProLicenseCount() > 0 && allProLicensesUsed;
      };

      $scope.isPlanActive = function () {
        return planFactory.isSubscribed() || planFactory.isOnTrial();
      };

      $scope.isProAvailable = function () {
        return $scope.getProLicenseCount() > 0 && !$scope.areAllProLicensesUsed();
      };

      $scope.isProApplicable = function () {
        return !playerProFactory.is3rdPartyPlayer($scope.display) &&
               !playerProFactory.isUnsupportedPlayer($scope.display);
      };

      $scope.isValidEmail = function (email) {
        return email && email.text && EMAIL_REGEX.test(email.text);
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
        $scope.display.monitoringEmails = $scope.monitoringEmailsList.map(function(t) { return t.text; });
        $scope.display.monitoringSchedule = _formatTimeline($scope.monitoringSchedule);

        if (!$scope.displayDetails.$valid) {
          console.info('form not valid: ', $scope.displayDetails.$error);

          return $q.reject();
        } else {
          return displayFactory.updateDisplay();
        }
      };

      function _formatTimeline(timeline) {
        var resp = {};

        if (!timeline.timeDefined) {
          return null;
        }

        if (timeline.startTime || timeline.endTime) {
          resp.time = {};
          resp.time.start = timeline.startTime ? $filter('date')(new Date(timeline.startTime), 'HH:mm') : null;
          resp.time.end = timeline.endTime ? $filter('date')(new Date(timeline.endTime), 'HH:mm') : null;
        }

        if (timeline.recurrenceDaysOfWeek && timeline.recurrenceDaysOfWeek.length > 0) {
          resp.week = timeline.recurrenceDaysOfWeek.map(function (day) {
            return {
              day: day,
              active: true
            };
          });
        }

        resp = JSON.stringify(resp);

        return resp !== '{}' ? resp : null;
      }

      function _parseTimeline(tl) {
        var timeline = {};

        if (tl) {
          tl = JSON.parse(tl);

          if (tl.time) {
            timeline.startTime = tl.time.start ? _reformatTime(tl.time.start) : null;
            timeline.endTime = tl.time.end ? _reformatTime(tl.time.end) : null;
          }

          if (tl.week) {
            timeline.recurrenceDaysOfWeek = [];

            tl.week.forEach(function(d) {
              if (d.active) {
                timeline.recurrenceDaysOfWeek.push(d.day);
              }
            });
          }
        }

        return timeline;
      }

      function _reformatTime(timeString) {
        var today = $filter('date')(new Date(), 'dd-MMM-yyyy');
        var fullDate = new Date(today + ' ' + timeString);
        return $filter('date')(fullDate, 'dd-MMM-yyyy hh:mm a');
      }

      var startTrialListener = $rootScope.$on('risevision.company.updated', function () {
        $scope.company = userState.getCopyOfSelectedCompany(true);

        var assignedDisplays = $scope.company.playerProAssignedDisplays || [];
        $scope.display.playerProAuthorized = assignedDisplays.indexOf($scope.displayId) >= 0;
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
