'use strict';

angular.module('risevision.schedules.services')
  .factory('scheduleSelectorFactory', ['$filter', '$q', '$log', 'schedule', 'processErrorCode',
    'templateEditorFactory', 'playlistFactory', 'ScrollingListService',
    function ($filter, $q, $log, schedule, processErrorCode, templateEditorFactory, playlistFactory,
      ScrollingListService) {
      var schedulesComponent = {
        type: 'rise-schedules',
        hasSelectedSchedules: true
      };

      var factory = {
        search: {
          sortBy: 'name'
        },
        selectedSchedules: null,
        unselectedSchedules: null,
        selectedCount: 0
      };

      var _reset = function() {
        // reset search query
        factory.search = {
          sortBy: 'name'
        };
        factory.selectedCount = 0;
      };

      var _loadSelectedSchedules = function () {
        var search = {
          sortBy: 'name',
          filter: 'presentationIds:~\"' + templateEditorFactory.presentation.id + '\"'
        };

        schedulesComponent.hasSelectedSchedules = true;

        factory.selectedSchedules = [];
        factory.loadingSchedules = true;

        schedule.list(search)
          .then(function (result) {
            factory.selectedSchedules = result.items ? result.items : [];

            schedulesComponent.hasSelectedSchedules = !!factory.selectedSchedules.length;
          })
          .then(null, function (e) {
            factory.errorMessage = $filter('translate')('schedules-app.list.error');
            factory.apiError = processErrorCode('Schedules', 'load', e);

            $log.error(factory.errorMessage, e);
          })
          .finally(function () {
            factory.loadingSchedules = false;
          });
      };

      factory.getSchedulesComponent = function () {
        _loadSelectedSchedules();

        return schedulesComponent;
      };

      var _loadUnselectedSchedules = function () {
        factory.search.filter = 'NOT presentationIds:~\"' + templateEditorFactory.presentation.id + '\"';

        factory.unselectedSchedules = new ScrollingListService(schedule.list, factory.search);
      };

      factory.load = function () {
        _reset();

        _loadUnselectedSchedules();
      };

      var _getSelectedScheduleIds = function() {
        var filteredSchedules = _.filter(factory.unselectedSchedules.items.list, function (item) {
          return item.isSelected;
        });

        return _.map(filteredSchedules, function (item) {
          return item.id;
        });
      };

      var _updateSelectedSchedules = function () {
        var scheduleIds = _getSelectedScheduleIds();

        if (!scheduleIds.length) {
          return $q.resolve();
        }

        var playlistItem = playlistFactory.newPresentationItem(templateEditorFactory.presentation);

        return playlistFactory.initPlayUntilDone(playlistItem, templateEditorFactory.presentation, true)
          .then(function () {
            return schedule.addPresentation(scheduleIds, JSON.stringify(playlistItem));
          });
      };

      var _getUnselectedScheduleIds = function() {
        var filteredSchedules = _.filter(factory.selectedSchedules, function (item) {
          return item.isSelected === false;
        });

        return _.map(filteredSchedules, function (item) {
          return item.id;
        });
      };

      var _updateUnselectedSchedules = function () {
        var scheduleIds = _getUnselectedScheduleIds();

        if (!scheduleIds.length) {
          return $q.resolve();
        }

        return schedule.removePresentation(scheduleIds, templateEditorFactory.presentation.id);
      };

      var _updateSelectedCount = function() {
        factory.selectedCount = _getSelectedScheduleIds().length + _getUnselectedScheduleIds().length;
      };

      factory.selectItem = function (item, inSelectedSchedules) {
        if (item.isSelected === true) {
          item.isSelected = false;
        } else if (item.isSelected === false) {
          item.isSelected = true;
        } else {
          item.isSelected = !inSelectedSchedules;
        }

        _updateSelectedCount();
      };

      factory.isSelected = function (item, inSelectedSchedules) {
        if (item.isSelected === true) {
          return true;
        } else if (item.isSelected === false) {
          return false;
        } else {
          return inSelectedSchedules;
        }
      };

      factory.select = function () {
        if (factory.selectedCount === 0) {
          return;
        }

        factory.loadingSchedules = true;

        return $q.all([_updateSelectedSchedules(), _updateUnselectedSchedules()])
          .then(_loadSelectedSchedules);
      };

      return factory;
    }
  ]);
