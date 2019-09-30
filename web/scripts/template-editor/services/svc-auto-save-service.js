'use strict';

angular.module('risevision.template-editor.services')
  .constant('MINIMUM_INTERVAL_BETWEEN_SAVES', 5000)
  .constant('MAXIMUM_INTERVAL_BETWEEN_SAVES', 20000)
  .factory('AutoSaveService', ['$timeout', 'MINIMUM_INTERVAL_BETWEEN_SAVES', 'MAXIMUM_INTERVAL_BETWEEN_SAVES',
    function ($timeout, MINIMUM_INTERVAL_BETWEEN_SAVES, MAXIMUM_INTERVAL_BETWEEN_SAVES) {
      return function (saveFunction) {
        var factory = {},
          _lastSavedTimestamp = 0,
          _saveTimeout = null,
          _saving = false;

        var _getCurrentTimestamp = function () {
          return new Date().getTime();
        };

        var _programSave = function () {
          _saveTimeout = $timeout(function () {
            _saveTimeout = null;

            // if a previous save hasn't finished, give more time
            if (_saving) {
              _programSave();
            } else {
              _lastSavedTimestamp = _getCurrentTimestamp();
              _saving = true;

              saveFunction().finally(function () {
                _saving = false;
              });
            }
          }, MINIMUM_INTERVAL_BETWEEN_SAVES);
        };

        var _reprogramSave = function () {
          factory.clearSaveTimeout();
          _programSave();
        };

        factory.clearSaveTimeout = function () {
          if (_saveTimeout) {
            $timeout.cancel(_saveTimeout);
            _saveTimeout = null;
          }
        };

        factory.save = function () {
          if (_saveTimeout) {
            var elapsed = _getCurrentTimestamp() - _lastSavedTimestamp;

            if (elapsed < MAXIMUM_INTERVAL_BETWEEN_SAVES) {
              _reprogramSave();
            }
          } else {
            _programSave();
          }
        };

        return factory;
      };
    }
  ]);
