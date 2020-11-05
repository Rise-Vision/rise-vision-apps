'use strict';

angular.module('risevision.apps.services')
  .factory('companyAssetsFactory', ['$rootScope', '$q', 'CachedRequest', 'ScrollingListService',
    'schedule', 'display', 'productsFactory',
    function ($rootScope, $q, CachedRequest, ScrollingListService, schedule, display,
      productsFactory) {
      var factory = {};

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
      var weeklyTemplatesSearch = {
        // sortBy: 'templateReleaseDate DESC',
        filter: 'templateOfTheWeek:1',
        category: 'Templates',
        count: 4
      };

      var scheduleListRequest = new CachedRequest(schedule.list, scheduleSearch);
      var displayListRequest = new CachedRequest(display.list, displaySearch);

      var addScheduleListener, addScheduleCompleted;
      var addDisplayListener, addDisplayCompleted;
      var displaysListListener, activeDisplayCompleted;

      factory.weeklyTemplates = new ScrollingListService(productsFactory.loadProducts, weeklyTemplatesSearch);

      var _sendUpdateEvent = function () {
        $rootScope.$broadcast('companyAssetsUpdated');
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
          if (display.playerVersion || display.lastActivityDate ||
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
