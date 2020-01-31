'use strict';

angular.module('risevision.schedules.services')
  .factory('createFirstSchedule', ['$q', '$state', '$modal', 'scheduleFactory', 'playlistFactory',
    'onboardingFactory',
    function ($q, $state, $modal, scheduleFactory, playlistFactory, onboardingFactory) {

      return function (presentation) {
        return scheduleFactory.checkFirstSchedule()
          .then(function () {
            scheduleFactory.newSchedule(true);

            scheduleFactory.schedule.name = 'All Displays - 24/7';
            scheduleFactory.schedule.distributeToAll = true;

            return playlistFactory.addPresentationItem(presentation);
          })
          .then(function () {
            return scheduleFactory.addSchedule();
          })
          .then(function () {
            if (scheduleFactory.errorMessage) {
              return $q.reject(scheduleFactory.errorMessage);
            }
          })
          .then(function () {
            if (onboardingFactory.isTemplateOnboarding()) {
              $state.go('apps.launcher.onboarding');
            } else {
              $modal.open({
                templateUrl: 'partials/schedules/auto-schedule-modal.html',
                size: 'md',
                controller: 'AutoScheduleModalController',
                resolve: {
                  presentationName: function () {
                    return presentation.name;
                  }
                }
              });
            }
          });
      };

    }
  ]);
