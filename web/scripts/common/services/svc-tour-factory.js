'use strict';

angular.module('risevision.apps.services')
  .service('tourFactory', ['localStorageService', '$sessionStorage',
    function (localStorageService, $sessionStorage) {
      var factory = {};

      var _getStorageKey = function (key) {
        return key + 'Seen';
      };

      factory.isShowing = function (key) {
        var storageKey = _getStorageKey(key);
        if ($sessionStorage[storageKey] === true) {
          return false;
        }

        var count = localStorageService.get(storageKey) || 0;
        if (count > 5) {
          return false;
        }

        localStorageService.set(storageKey, count + 1);

        return true;
      };

      factory.dismissed = function (key) {
        $sessionStorage[_getStorageKey(key)] = true;
      };

      return factory;
    }
  ]);
