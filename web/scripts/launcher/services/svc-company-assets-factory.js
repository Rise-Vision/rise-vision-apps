'use strict';

angular.module('risevision.apps.launcher.services')
  .factory('companyAssetsFactory', ['$rootScope', '$q', 'CachedRequest',
    'presentation', 'schedule', 'display',
    function ($rootScope, $q, CachedRequest, presentation, schedule, display) {
      var factory = {};

      var presentationSearch = {
        sortBy: 'changeDate',
        reverse: true,
        count: 1
      };
      var scheduleSearch = {
        sortBy: 'changeDate',
        reverse: true,
        count: 1
      };
      var displaySearch = {
        sortBy: 'changeDate',
        reverse: true,
        count: 20
      };
      var presentationListRequest = new CachedRequest(presentation.list, presentationSearch);
      var scheduleListRequest = new CachedRequest(schedule.list, scheduleSearch);
      var displayListRequest = new CachedRequest(display.list, displaySearch);

      var addScheduleListener, addScheduleCompleted;
      var addDisplayListener, addDisplayCompleted;
      var displaysListListener, activeDisplayCompleted;

      var _sendUpdateEvent = function () {
        $rootScope.$broadcast('companyAssetsUpdated');
      };

      factory.hasPresentations = function (forceReload) {
        return presentationListRequest.execute(forceReload).then(function (resp) {
          return !!(resp && resp.items && resp.items.length > 0);
        });
      };

      var _clearScheduleListener = function () {
        if (addScheduleListener) {
          addScheduleListener();
          addScheduleListener = null;
        }
      };

      var _addScheduleListener = function () {
        if (!addScheduleListener) {
          addScheduleListener = $rootScope.$on('scheduleCreated', function (event) {
            addScheduleCompleted = true;

            _clearScheduleListener();

            _sendUpdateEvent();
          });
        }
      };

      factory.hasSchedules = function () {
        if (addScheduleCompleted) {
          return $q.resolve(true);
        }

        return scheduleListRequest.execute().then(function (resp) {
          addScheduleCompleted = !!(resp && resp.items && resp.items.length > 0);

          if (!addScheduleCompleted) {
            _addScheduleListener();
          }

          return addScheduleCompleted;
        });
      };

      var _clearDisplayListener = function () {
        if (addDisplayListener) {
          addDisplayListener();
          addDisplayListener = null;
        }
      };

      var _addDisplayListener = function () {
        if (!addDisplayListener) {
          addDisplayListener = $rootScope.$on('displayCreated', function (event) {
            addDisplayCompleted = true;

            _clearDisplayListener();

            displayListRequest.reset();

            _sendUpdateEvent();
          });
        }
      };

      var _clearActiveDisplayListener = function () {
        if (addDisplayListener) {
          addDisplayListener();
          addDisplayListener = null;
        }
      };

      var _addActiveDisplayListener = function () {
        if (!displaysListListener) {
          displaysListListener = $rootScope.$on('displaysLoaded', function (event, displays) {
            _validateActiveDisplay(displays);
          });
        }
      };

      var _validateActiveDisplay = function (displays) {
        activeDisplayCompleted = false;

        displays.forEach(function (display) {
          if (display.playerVersion || display.lastConnectionTime ||
            display.onlineStatus === 'online') {
            activeDisplayCompleted = true;
          }
        });

        if (activeDisplayCompleted) {
          _sendUpdateEvent();

          _clearActiveDisplayListener();
        } else {
          _addActiveDisplayListener();
        }
      };

      factory.getFirstDisplay = function () {
        return displayListRequest.execute().then(function (resp) {
          var hasDisplays = resp && resp.items && resp.items.length > 0;

          if (!hasDisplays) {
            return $q.resolve();
          } else {
            return $q.resolve(resp.items[0]);
          }
        });
      };

      factory.hasDisplays = function (forceReload) {
        if (addDisplayCompleted && activeDisplayCompleted) {
          return $q.resolve({
            hasDisplays: addDisplayCompleted,
            hasActivatedDisplays: activeDisplayCompleted
          });
        }

        var deferred = $q.defer();

        return displayListRequest.execute(forceReload).then(function (resp) {
          addDisplayCompleted = !!(resp && resp.items && resp.items.length > 0);

          if (!addDisplayCompleted) {
            activeDisplayCompleted = false;
            _addDisplayListener();
          } else {
            _validateActiveDisplay(resp.items);
          }

          return {
            hasDisplays: addDisplayCompleted,
            hasActivatedDisplays: activeDisplayCompleted
          };
        });
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        presentationListRequest.reset();
        scheduleListRequest.reset();
        displayListRequest.reset();

        addScheduleCompleted = undefined;

        addDisplayCompleted = undefined;
        _clearDisplayListener();

        activeDisplayCompleted = undefined;
        _clearActiveDisplayListener();

      });

      return factory;
    }
  ]);
