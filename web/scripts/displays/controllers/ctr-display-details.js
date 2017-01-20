'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayDetails', ['$scope', '$q', '$state',
    'displayFactory', 'display', '$loading', '$log', '$modal',
    '$templateCache',
    'displayId',
    function ($scope, $q, $state, displayFactory, display, $loading, $log,
      $modal,
      $templateCache, displayId) {
      $scope.factory = displayFactory;
      $scope.displayService = display;

      displayFactory.getDisplay(displayId).then(function () {
        $scope.display = displayFactory.display;
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
          $log.info('form not valid: ', $scope.displayDetails.$error);

          return $q.reject();
        } else {
          return displayFactory.updateDisplay();
        }
      };

      $scope.$watch('display.browserUpgradeMode', function () {
        if ($scope.display && $scope.display.browserUpgradeMode !== 0) {
          $scope.display.browserUpgradeMode = 1;
        }
      });
    }
  ]);
