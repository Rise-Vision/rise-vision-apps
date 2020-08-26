'use strict';

angular.module('risevision.schedules.services')
  .factory('createFirstSchedule', ['$q', '$state', 'scheduleFactory', 'playlistFactory',
    function ($q, $state, scheduleFactory, playlistFactory) {

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
          });
      };

    }
  ]);
