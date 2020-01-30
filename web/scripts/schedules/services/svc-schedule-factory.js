'use strict';

angular.module('risevision.schedules.services')
  .factory('scheduleFactory', ['$q', '$state', '$log', '$modal', '$rootScope', 'schedule', 'scheduleTracker',
    'onboardingFactory', 'blueprintFactory', 'processErrorCode', 'VIEWER_URL', 'HTML_PRESENTATION_TYPE',
    function ($q, $state, $log, $modal, $rootScope, schedule, scheduleTracker, onboardingFactory,
      blueprintFactory, processErrorCode, VIEWER_URL, HTML_PRESENTATION_TYPE) {
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
          content: [],
          distributeToAll: false,
          distribution: []
        };

        _clearMessages();
      };

      _init();

      factory.newSchedule = function () {
        scheduleTracker('Add Schedule');

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
            factory.schedule = result.item;

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
          _checkFirstSchedule()
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

      var _checkFirstSchedule = function () {
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

      var _initFirstSchedule = function (presentation) {
        var item = {
          name: presentation.name,
          objectReference: presentation.id,
          playUntilDone: false,
          duration: 10,
          timeDefined: false,
          type: 'presentation'
        };
        var schedule = {
          name: 'All Displays - 24/7',
          content: [item],
          distributeToAll: true,
          timeDefined: false
        };

        if (presentation.presentationType) {
          item.presentationType = presentation.presentationType;
        }

        if (presentation.presentationType === HTML_PRESENTATION_TYPE) {
          return blueprintFactory.isPlayUntilDone(presentation.productCode)
            .then(function (playUntilDone) {
              if (playUntilDone) {
                item.playUntilDone = true;
              }
            })
            .catch(function (e) {
              $log.error(factory.errorMessage, e);
            })
            .then(function () {
              return schedule;
            });
        } else {
          return schedule;          
        }

      };

      factory.createFirstSchedule = function (presentation) {

        return _checkFirstSchedule()
          .then(function (result) {
            return _initFirstSchedule(presentation);
          })
          .then(function(firstSchedule) {
            return schedule.add(firstSchedule);
          })
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              _hasSchedules = true;

              $rootScope.$emit('scheduleCreated');

              scheduleTracker('Schedule Created', resp.item.id, resp.item.name);

              return $q.resolve();
            } else {
              return $q.reject('Error adding Schedule');
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
                    return presentationName;
                  }
                }
              });
            }
          });
      };

      factory.addSchedule = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingSchedule = true;
        factory.savingSchedule = true;

        schedule.add(factory.schedule)
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              $rootScope.$emit('scheduleCreated');

              scheduleTracker('Schedule Created', resp.item.id, resp.item.name);

              $state.go('apps.schedules.details', {
                scheduleId: resp.item.id
              });
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

        schedule.update(_scheduleId, factory.schedule)
          .then(function (scheduleId) {
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

      factory.deleteSchedule = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingSchedule = true;

        schedule.delete(_scheduleId)
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

      factory.getPreviewUrl = function () {
        if (_scheduleId) {
          return VIEWER_URL + '/?type=schedule&id=' + _scheduleId;
        }
        return null;
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
