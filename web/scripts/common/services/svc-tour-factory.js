'use strict';

angular.module('risevision.apps.services')
  .service('tourFactory', ['localStorageService',
    function (localStorageService) {
      var factory = {};

      var _getDismissedKey = function(key) {
        return key + '.dismissed';
      };

      factory.isShowing = function(key) {
        return localStorageService.get(_getDismissedKey(key)) !== true;
      };

      factory.dismissed = function (key) {
        var dismissedKey = key + '.dismissed';

        localStorageService.set(_getDismissedKey(key), true);
      };

      return factory;
    }
  ]);
