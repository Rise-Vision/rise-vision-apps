'use strict';

angular.module('risevision.schedules.services')
  .factory('scheduleSelectorFactory', ['$filter', '$q', '$log', 'schedule', 'processErrorCode',
    'playlistFactory', 'ScrollingListService', '$modal', 'companyAssetsFactory', '$state',
    function ($filter, $q, $log, schedule, processErrorCode, playlistFactory, ScrollingListService, $modal, companyAssetsFactory, $state) {
      var factory = {
        search: {
          sortBy: 'name'
        },
        selectedSchedules: null,
        unselectedSchedules: null,
        selectedCount: 0
      };

      var schedulesComponent = {
        type: 'rise-schedules',
        factory: factory
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
          filter: 'presentationIds:~\"' + factory.presentation.id + '\"'
        };

        factory.hasSelectedSchedules = true;

        factory.selectedSchedules = [];
        factory.loadingSchedules = true;

        schedule.list(search)
          .then(function (result) {
            factory.selectedSchedules = result.items ? result.items : [];

            factory.hasSelectedSchedules = !!factory.selectedSchedules.length;
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

      factory.getSchedulesComponent = function (currentPresentation) {
        factory.presentation = currentPresentation;
        _loadSelectedSchedules();

        return schedulesComponent;
      };

      var _loadUnselectedSchedules = function () {
        factory.search.filter = 'NOT presentationIds:~\"' + factory.presentation.id + '\"';

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

      var _getUnselectedScheduleIds = function() {
        var filteredSchedules = _.filter(factory.selectedSchedules, function (item) {
          return item.isSelected === false;
        });

        return _.map(filteredSchedules, function (item) {
          return item.id;
        });
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

      var _updateSelectedSchedules = function () {
        var scheduleIds = _getSelectedScheduleIds();

        if (!scheduleIds.length) {
          return $q.resolve();
        }

        var playlistItem = playlistFactory.newPresentationItem(factory.presentation);

        return playlistFactory.initPlayUntilDone(playlistItem, factory.presentation, true)
          .then(function () {
            return schedule.addPresentation(scheduleIds, JSON.stringify(playlistItem));
          });
      };

      var _updateUnselectedSchedules = function () {
        var scheduleIds = _getUnselectedScheduleIds();

        if (!scheduleIds.length) {
          return $q.resolve();
        }

        return schedule.removePresentation(scheduleIds, factory.presentation.id);
      };

      factory.select = function () {
        if (factory.selectedCount === 0) {
          return;
        }

        factory.loadingSchedules = true;

        return $q.all([_updateSelectedSchedules(), _updateUnselectedSchedules()])
          .then(_loadSelectedSchedules);
      };

      factory.addSchedule = function () {
        $state.go('apps.schedules.add', {
          presentationItem: factory.presentation
        });
      };

      factory.checkAssignedToSchedules = function() {
        return companyAssetsFactory.hasSchedules().then(function(hasSchedules) {
          if (hasSchedules && !factory.hasSelectedSchedules) {
            return _showAddToScheduleModal();
          } else {
            return $q.resolve();
          }
        }).catch(function() {
          return $q.reject();
        });
      };

      var _showAddToScheduleModal = function() {
        var modalInstance = $modal.open({
          templateUrl: 'partials/schedules/add-to-schedule-modal.html',
          controller: 'AddToScheduleModalController',
          windowClass: 'madero-style centered-modal',
          size: 'sm'
        });
        return modalInstance.result;
      };

      return factory;
    }
  ]);
