'use strict';

angular.module('risevision.schedules.services')
  .factory('scheduleFactory', ['$q', '$state', '$log', '$rootScope', 'schedule', 'scheduleTracker',
    'processErrorCode', 'display', 'userState', 'confirmModal', 'insecureUrl',
    function ($q, $state, $log, $rootScope, schedule, scheduleTracker, processErrorCode,
      display, userState, confirmModal, insecureUrl) {
      var factory = {};
      var _hasSchedules;
      var _scheduleId;

      var _clearMessages = function () {
        factory.loadingSchedule = false;
        factory.savingSchedule = false;

        factory.apiError = '';
      };

      var _init = function () {
        _scheduleId = undefined;

        factory.schedule = {
          name: 'New Schedule',
          companyId: userState.getSelectedCompanyId(),
          content: [],
          distributeToAll: false,
          distribution: [],
          timeDefined: false
        };

        _clearMessages();
      };

      _init();

      factory.newSchedule = function (skipTracking) {
        if (!skipTracking) {
          scheduleTracker('Add Schedule');
        }

        _init();
      };

      factory.getSchedule = function (scheduleId) {
        var deferred = $q.defer();

        _clearMessages();
        //load the schedule based on the url param
        _scheduleId = scheduleId;

        //show loading spinner
        factory.loadingSchedule = true;

        schedule.get(_scheduleId)
          .then(function (result) {
            _hasSchedules = true;

            factory.schedule = result.item;

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage(e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingSchedule = false;
          });

        return deferred.promise;
      };

      factory.hasSchedules = function () {
        if (typeof _hasSchedules === 'undefined') {
          _hasSchedules = false;

          // Load status in background. Used by Template Editor to enable/disable Publish button for first time users
          // The objective is being able to associate the Auto Schedule Modal with a user action (in this case, Publish)
          factory.checkFirstSchedule()
            .then(function () {
              _hasSchedules = false;
            })
            .catch(function (err) {
              if (err !== 'Already have Schedules') {
                console.log('Failed while checking if company has Schedules', err);
              }
            });
        }

        return _hasSchedules;
      };

      factory.checkFirstSchedule = function () {
        var deferred = $q.defer();

        if (!_hasSchedules) {
          schedule.list({
            count: 1
          }).then(function (result) {

            if (result && (!result.items || result.items.length === 0)) {
              deferred.resolve();
            } else {
              _hasSchedules = true;
              deferred.reject('Already have Schedules');
            }
          }, function (error) {
            deferred.reject(error);
          });
        } else {
          deferred.reject('Already have Schedules');
        }

        return deferred.promise;
      };

      factory.getAllDisplaysSchedule = function () {
        return schedule.list({
            filter: 'distributeToAll:true'
          }).then(function (result) {
            if (result && result.items && result.items.length > 0) {
              return result.items[0];
            }
          })
          .catch(function () {});
      };

      factory.hasFreeDisplays = function () {
        var distribution = factory.schedule.distribution ? factory.schedule.distribution : [];

        if (!distribution.length && !factory.schedule.distributeToAll) {
          return $q.resolve([]);
        }

        return display.hasFreeDisplays(factory.schedule.companyId,
          factory.schedule.distributeToAll ? null : distribution);
      };

      factory.checkFreeDisplays = function () {
        if (!factory.requiresLicense()) {
          return $q.resolve([]);
        }

        return factory.hasFreeDisplays();
      };

      factory.addSchedule = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingSchedule = true;
        factory.savingSchedule = true;

        return _addSchedule()
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              _hasSchedules = true;

              $rootScope.$emit('scheduleCreated');

              scheduleTracker('Schedule Created', resp.item.id, resp.item.name);

              if ($state.current.name === 'apps.schedules.add') {
                $state.go('apps.schedules.details', {
                  scheduleId: resp.item.id
                });
              }
            }
          })
          .then(null, function (e) {
            _showErrorMessage(e);
          })
          .finally(function () {
            factory.loadingSchedule = false;
            factory.savingSchedule = false;
          });
      };

      factory.updateSchedule = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingSchedule = true;
        factory.savingSchedule = true;

        _updateSchedule()
          .then(function (resp) {
            factory.schedule = resp.item;

            scheduleTracker('Schedule Updated', _scheduleId, factory.schedule.name);

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage(e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingSchedule = false;
            factory.savingSchedule = false;
          });

        return deferred.promise;
      };

      factory.forceUpdateSchedule = function (providedSchedule) {
        var scheduleToUpdate = providedSchedule || factory.schedule;

        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingSchedule = true;
        factory.savingSchedule = true;

        schedule.update(scheduleToUpdate.id, scheduleToUpdate, true)
          .then(function (resp) {
            if (!providedSchedule) {
              factory.schedule = resp.item;
            }

            scheduleTracker('Schedule Updated', scheduleToUpdate.id, scheduleToUpdate.name);

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage(e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingSchedule = false;
            factory.savingSchedule = false;
          });

        return deferred.promise;
      };

      factory.deleteSchedule = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingSchedule = true;

        return schedule.delete(_scheduleId)
          .then(function () {
            _hasSchedules = undefined;
            scheduleTracker('Schedule Deleted', _scheduleId, factory.schedule.name);

            factory.schedule = {};

            $state.go('apps.schedules.list');
          })
          .then(null, function (e) {
            _showErrorMessage(e);
          })
          .finally(function () {
            factory.loadingSchedule = false;
          });
      };

      factory.addToDistribution = function (display, schedule) {
        if (!schedule || !schedule.id || schedule.id === display.scheduleId || schedule.distributeToAll) {
          return $q.resolve();
        } else {
          $log.info('Adding to Distribution: ', display.id, schedule.id);

          _addToDistributionList(display.id, schedule);
          return factory.forceUpdateSchedule(schedule).then(function () {
            display.scheduleId = schedule.id;
            display.scheduleName = schedule.name;
          });
        }
      };

      var _addToDistributionList = function (displayId, schedule) {
        schedule.distribution = schedule.distribution ? schedule.distribution : [];
        if (schedule.distribution.indexOf(displayId) === -1) {
          schedule.distribution.push(displayId);
        }
      };

      factory.requiresLicense = function (schedule) {
        schedule = schedule || factory.schedule;

        if (schedule && schedule.content && schedule.content.length > 0) {
          for (var i = 0; i < schedule.content.length; i++) {
            if (schedule.content[i].type === 'presentation') {
              return true;
            }
          }
        }
        return false;
      };

      factory.hasInsecureUrls = function (schedule) {
        schedule = schedule || factory.schedule;

        if (schedule && schedule.content && schedule.content.length > 0) {
          for (var i = 0; i < schedule.content.length; i++) {
            if (schedule.content[i].type === 'url' && insecureUrl(schedule.content[i].objectReference)) {
              return true;
            }
          }
        }
        return false;
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _hasSchedules = undefined;
      });

      var _updateSchedule = function () {
        return schedule.update(_scheduleId, factory.schedule).catch(function (err) {
          if (err.result.error.code === 409) {
            return _showDistributionConflictModal()
              .then(function () {
                return $q.resolve(schedule.update(_scheduleId, factory.schedule, true));
              });
          }
          return $q.reject(err);
        });
      };

      var _addSchedule = function () {
        return schedule.add(factory.schedule).catch(function (err) {
          if (err.result.error.code === 409) {
            return _showDistributionConflictModal()
              .then(function () {
                return $q.resolve(schedule.add(factory.schedule, true));
              });
          }
          return $q.reject(err);
        });
      };

      var _showDistributionConflictModal = function () {
        return confirmModal('The selected displays already have schedules.',
            'Some of the displays you selected are already assigned to another schedule. Would you like to re-assign them to this schedule?',
            'Yes', 'No', 'madero-style centered-modal reassign-distribtion-modal',
            'partials/components/confirm-modal/madero-confirm-modal.html')
          .catch(function () {
            return $q.reject({
              message: 'Some of the displays are already assigned to another schedule.'
            });
          });
      };

      var _showErrorMessage = function (e) {
        factory.apiError = processErrorCode(e);

        $log.error(factory.apiError, e);
      };

      return factory;
    }
  ]);
