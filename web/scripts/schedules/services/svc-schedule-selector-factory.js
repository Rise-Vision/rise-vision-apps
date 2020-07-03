'use strict';

angular.module('risevision.schedules.services')
   .factory('scheduleSelectorFactory', ['$filter', '$q', '$log', 'schedule', 'processErrorCode', 'templateEditorFactory',
    function ($filter, $q, $log, schedule, processErrorCode, templateEditorFactory) {
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

      var _loadSchedules = function(includesPresentation) {
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
        factory.nonSelectedSchedules = [];

        _loadSchedules(false)
          .then(function (result) {
            factory.nonSelectedSchedules = result.items ? result.items : [];
          });
      };

      factory.doSearch = function() {
        factory.loadNonSelectedSchedules();
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

      factory.getSelectedIds = function () {
        return _.filter(factory.nonSelectedSchedules, function (item) {
          return item.isSelected;
        });  
      };

      return factory;
    }
  ]);