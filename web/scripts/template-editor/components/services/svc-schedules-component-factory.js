'use strict';

angular.module('risevision.template-editor.services')
  .factory('schedulesComponentFactory', ['$rootScope', '$filter', '$q', '$log', 'schedule',
  'processErrorCode',
    function ($rootScope, $filter, $q, $log, schedule, processErrorCode) {
      var schedulesComponent = {
        type: 'rise-schedules',
        hasSelectedSchedules: true
      };
      var factory = {
        selectedSchedules: null
      };

      var _loadSchedules = function (forceRefresh) {
        if (!factory.selectedSchedules || forceRefresh) {
          factory.loadingSchedules = true;
          factory.selectedSchedules = [];
          schedulesComponent.hasSelectedSchedules = true;

          schedule.list({})
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
        }
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _loadSchedules(true);
      });

      factory.getSchedulesComponent = function () {
        _loadSchedules();

        return schedulesComponent;
      };

      return factory;
    }
  ]);
