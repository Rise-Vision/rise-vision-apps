'use strict';

angular.module('risevision.schedules.services')
  .factory('scheduleFactory', ['$q', '$state', '$log', '$rootScope', 'schedule', 'scheduleTracker',
    'processErrorCode', 'HTML_PRESENTATION_TYPE', 'display', 'plansFactory', 'userState', 'confirmModal',
    function ($q, $state, $log, $rootScope, schedule, scheduleTracker, processErrorCode,
      HTML_PRESENTATION_TYPE, display, plansFactory, userState, confirmModal) {
      var factory = {};
      var _hasSchedules;
      var _scheduleId;

      var _clearMessages = function () {
        factory.loadingSchedule = false;
        factory.savingSchedule = false;

        factory.errorMessage = '';
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
            factory.schedule.changeCount = 0;

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('get', e);

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

      var _retrieveHasFreeDisplays = function () {
        var distribution = factory.schedule.distribution ? factory.schedule.distribution : [];
        return display.hasFreeDisplays(factory.schedule.companyId,
          factory.schedule.distributeToAll ? null : distribution);
      };

      var _showFreeDisplaysMessageIfNeeded = function (hasFreeDisplays) {
        if (hasFreeDisplays) {
          plansFactory.showLicenseRequiredToUpdateModal();
        }
      };

      factory.addSchedule = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingSchedule = true;
        factory.savingSchedule = true;

        return $q.all([_retrieveHasFreeDisplays(), _addSchedule()])
          .then(function (results) {
            _showFreeDisplaysMessageIfNeeded(results[0]);

            var resp = results[1];
            if (resp && resp.item && resp.item.id) {
              _hasSchedules = true;

              $rootScope.$emit('scheduleCreated');

              scheduleTracker('Schedule Created', resp.item.id, resp.item.name);
              factory.logTransitionUsage(resp.item);

              if ($state.current.name === 'apps.schedules.add') {
                $state.go('apps.schedules.details', {
                  scheduleId: resp.item.id
                });
              }
            }
          })
          .then(null, function (e) {
            _showErrorMessage('add', e);
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

        $q.all([_retrieveHasFreeDisplays(), _updateSchedule()])
          .then(function (results) {
            _showFreeDisplaysMessageIfNeeded(results[0]);

            if (isNaN(factory.schedule.changeCount)) {
              factory.schedule.changeCount = 0;
            } else {
              factory.schedule.changeCount++;
            }

            scheduleTracker('Schedule Updated', _scheduleId, factory.schedule.name);

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('update', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingSchedule = false;
            factory.savingSchedule = false;
          });

        return deferred.promise;
      };

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
          });;
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
            _showErrorMessage('delete', e);
          })
          .finally(function () {
            factory.loadingSchedule = false;
          });
      };

      factory.scheduleHasTransitions = function (schedule) {
        var content = schedule && schedule.content;

        return !!_.find(content || [], function (item) {
          return item.transitionType && item.transitionType !== 'normal';
        });
      };

      factory.logTransitionUsage = function (newSchedule, oldSchedule) {
        var existingTransitions = factory.scheduleHasTransitions(oldSchedule);
        var addedTransitions = factory.scheduleHasTransitions(newSchedule);

        if (!existingTransitions && addedTransitions) {
          scheduleTracker('Transitions Added', newSchedule.id, newSchedule.name);
        } else if (existingTransitions && !addedTransitions) {
          scheduleTracker('Transitions Removed', newSchedule.id, newSchedule.name);
        }

        return addedTransitions;
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _hasSchedules = undefined;
      });

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + ' Schedule.';
        factory.apiError = processErrorCode('Schedule', action, e);

        $log.error(factory.errorMessage, e);
      };

      return factory;
    }
  ]);
