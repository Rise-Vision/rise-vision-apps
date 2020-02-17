'use strict';

angular.module('risevision.schedules.controllers')
  .controller('scheduleDetails', ['$scope', '$q', '$state',
    'scheduleFactory', '$loading', '$log', '$modal', '$templateCache',
    function ($scope, $q, $state, scheduleFactory, $loading, $log, $modal,
      $templateCache) {
      $scope.factory = scheduleFactory;
      $scope.schedule = scheduleFactory.schedule;

      var _oldSchedule = _.cloneDeep($scope.schedule);

      $scope.$watch('factory.loadingSchedule', function (loading) {
        if (loading) {
          $loading.start('schedule-loader');
        } else {
          $loading.stop('schedule-loader');
        }
      });

      $scope.confirmDelete = function () {
        $scope.modalInstance = $modal.open({
          template: $templateCache.get(
            'partials/components/confirm-modal/confirm-modal.html'),
          controller: 'confirmModalController',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'schedules-app.details.deleteTitle';
            },
            confirmationMessage: function () {
              return 'schedules-app.details.deleteWarning';
            },
            confirmationButton: function () {
              return 'common.delete-forever';
            },
            cancelButton: null
          }
        });

        $scope.modalInstance.result.then(scheduleFactory.deleteSchedule);
      };

      $scope.addSchedule = function () {
        if (!$scope.scheduleDetails.$dirty) {
          $state.go('apps.schedules.add');
        } else {
          $scope.modalInstance = $modal.open({
            template: $templateCache.get(
              'partials/components/confirm-modal/confirm-modal.html'),
            controller: 'confirmModalController',
            windowClass: 'modal-custom',
            resolve: {
              confirmationTitle: function () {
                return 'schedules-app.details.unsavedTitle';
              },
              confirmationMessage: function () {
                return 'schedules-app.details.unsavedWarning';
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
                $state.go('apps.schedules.add');
              });
          }, function (value) {
            // do what you need to do if user cancels
            if (value) {
              $state.go('apps.schedules.add');
            }
          });
        }
      };

      $scope.save = function () {
        if (!$scope.scheduleDetails.$valid) {
          console.info('form not valid: ', $scope.scheduleDetails.$error);

          return $q.reject();
        } else {
          return scheduleFactory.updateSchedule()
            .then(function () {
              scheduleFactory.logTransitionUsage($scope.schedule, _oldSchedule);
              _oldSchedule = _.cloneDeep($scope.schedule);
            });
        }
      };
    }
  ]);
