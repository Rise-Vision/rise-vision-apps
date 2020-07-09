'use strict';

angular.module('risevision.apps.services')
  .service('tourFactory', ['$sessionStorage', 'userState', 'updateUser',
    function ($sessionStorage, userState, updateUser) {
      var factory = {};

      var _getStorageKey = function (key) {
        return key + 'Seen';
      };

      var _getCount = function (storageKey) {
        var profile = userState.getCopyOfProfile();

        if (profile && profile.settings && profile.settings[storageKey]) {
          var value = profile.settings[storageKey];
          var count = parseInt(value);
          if (isNaN(count)) {
            count = 0;
          }

          return count;
        } else {
          return 0;
        }
      };

      var _updateCount = function (storageKey, value) {
        var settings = {};
        settings[storageKey] = value;

        return updateUser(userState.getUsername(), {
            settings: settings
          })
          .then(function (resp) {
            userState.updateUserProfile(resp.item);
          });
      };

      factory.isShowing = function (key) {
        var storageKey = _getStorageKey(key);
        if ($sessionStorage[storageKey] === true) {
          return false;
        }

        var count = _getCount(storageKey);
        if (count > 5) {
          return false;
        }

        _updateCount(storageKey, count + 1);

        return true;
      };

      factory.dismissed = function (key) {
        $sessionStorage[_getStorageKey(key)] = true;
      };

      return factory;
    }
  ]);
