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

      factory.isShowing = function (key, readOnly) {
        var storageKey = _getStorageKey(key);

        if ($sessionStorage[storageKey] === true) {
          return false;
        }

        var count = _getCount(storageKey);
        if (count > 3) {
          return false;
        }

        if (!readOnly) {
          _updateCount(storageKey, count + 1);
        }

        return true;
      };

      factory.findActiveKey = function (keys) {
        if (angular.isArray(keys)) {
          for (var i = 0; i < keys.length; i++) {
            if (factory.isShowing(keys[i], true)) {
              return keys[i];
            }
          }
        }

        return null;
      };

      factory.dismissed = function (key) {
        $sessionStorage[_getStorageKey(key)] = true;
      };

      return factory;
    }
  ]);
