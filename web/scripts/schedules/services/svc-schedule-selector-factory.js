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
        nonSelectedSchedules: null
      };

      var _loadSchedules = function (includesPresentation) {
        var search = angular.copy(factory.search);
        search.filter = (includesPresentation ? '' : 'NOT ') +
          'presentationIds:~\"' + templateEditorFactory.presentation.id + '\"';

        factory.loadingSchedules = true;

        return schedule.list(search)
          .then(null, function (e) {
            factory.errorMessage = $filter('translate')('schedules-app.list.error');
            factory.apiError = processErrorCode('Schedules', 'load', e);

            $log.error(factory.errorMessage, e);
          })
          .finally(function () {
            factory.loadingSchedules = false;
          });
      };

      var _loadSelectedSchedules = function () {
        schedulesComponent.hasSelectedSchedules = true;

        factory.selectedSchedules = [];

        _loadSchedules(true)
          .then(function (result) {
            factory.selectedSchedules = result.items ? result.items : [];

            schedulesComponent.hasSelectedSchedules = !!factory.selectedSchedules.length;
          });
      };

      factory.loadNonSelectedSchedules = function () {
        var search = angular.copy(factory.search);
        search.filter = 'NOT presentationIds:~\"' + templateEditorFactory.presentation.id + '\"';

        factory.nonSelectedSchedules = new ScrollingListService(schedule.list, search);
      };

      factory.getSchedulesComponent = function () {
        _loadSelectedSchedules();

        return schedulesComponent;
      };

      factory.selectItem = function (item, inSelectedSchedules) {
        if (item.isSelected === true) {
          item.isSelected = false;
        } else if (item.isSelected === false) {
          item.isSelected = true;
        } else {
          item.isSelected = !inSelectedSchedules;
        }
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

      var _updateSelectedSchedules = function () {
        var filteredSchedules = _.filter(factory.nonSelectedSchedules.items.list, function (item) {
          return item.isSelected;
        });
        var scheduleIds = _.map(filteredSchedules, function (item) {
          return item.id;
        });

        if (!scheduleIds.length) { return; }

        var playlistItem = playlistFactory.newPresentationItem(templateEditorFactory.presentation)

        return playlistFactory.initPlayUntilDone(playlistItem, templateEditorFactory.presentation, true)
          .then(function () {
            schedule.addPresentation(scheduleIds, JSON.stringify(playlistItem));
          });
      };

      var _updateUnselectedSchedules = function () {
        var filteredSchedules = _.filter(factory.selectedSchedules, function (item) {
          return item.isSelected === false;
        });
        var scheduleIds = _.map(filteredSchedules, function (item) {
          return item.id;
        });

        if (!scheduleIds.length) { return; }

        schedule.removePresentation(scheduleIds, templateEditorFactory.presentation.id);
      };

      factory.select = function () {
        _updateSelectedSchedules();
        _updateUnselectedSchedules();
      };

      return factory;
    }
  ]);
