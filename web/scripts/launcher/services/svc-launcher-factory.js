'use strict';

angular.module('risevision.apps.launcher.services')
  .factory('launcherFactory', ['$q', '$log', 'canAccessApps', 'presentation',
    'schedule', 'display', 'processErrorCode',
    function ($q, $log, canAccessApps, presentation, schedule, display, processErrorCode) {
      var factory = {};
      var deferred;
      var search = {
        sortBy: 'name',
        count: 20,
        reverse: false,
      };

      var _setDefaults = function () {
        factory.presentations = {
          loadingItems: true,
          list: []
        };
        factory.schedules = {
          loadingItems: true,
          list: []
        };
        factory.displays = {
          loadingItems: true,
          list: []
        };
      };

      _setDefaults();

      var _getDeferred = function (object, service, name) {
        var deferred = service.list(search)
          .then(function (result) {
            object.list = result.items || [];
          })
          .catch(function (e) {
            object.errorMessage = 'Failed to load ' + name + '.';
            object.apiError = processErrorCode(name, 'load', e);

            $log.error(object.errorMessage, e);
          })
          .finally(function () {
            object.loadingItems = false;
          });

        return deferred;
      };

      factory.load = function () {
        if (!deferred) {
          _setDefaults();

          deferred = canAccessApps()
            .then(function () {
              return $q.all([
                _getDeferred(factory.presentations, presentation, 'Presentations'),
                _getDeferred(factory.schedules, schedule, 'Schedules'),
                _getDeferred(factory.displays, display, 'Displays')
              ]);
            })
            .then(function () {
              deferred = undefined;
            });
        }

        return deferred;
      };

      return factory;
    }
  ]);
