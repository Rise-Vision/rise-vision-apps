'use strict';

angular.module('risevision.apps.launcher.services')
  .factory('launcherFactory', ['$q', 'canAccessApps', 'presentation',
    'schedule', 'display',
    function ($q, canAccessApps, presentation, schedule, display) {
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

      var _getDeferred = function (object, service) {
        var deferred = service.list(search)
          .then(function (result) {
            object.loadingItems = false;
            object.list = result.items || [];
          });

        return deferred;
      };

      factory.load = function () {
        if (!deferred) {
          _setDefaults();

          deferred = canAccessApps()
            .then(function () {

              return $q.all([
                _getDeferred(factory.presentations, presentation),
                _getDeferred(factory.schedules, schedule),
                _getDeferred(factory.displays, display)
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
