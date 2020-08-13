'use strict';

angular.module('risevision.common.components.scrolling-list')
  .service('processErrorCode', ['$filter', 'getError',
    function ($filter, getError) {
      var actionsMap = {
        get: 'loaded',
        load: 'loaded',
        add: 'added',
        update: 'updated',
        delete: 'deleted',
        publish: 'published',
        restore: 'restored',
        move: 'moved',
        rename: 'renamed',
        upload: 'uploaded',
        restart: 'restarted',
        reboot: 'rebooted'
      };

      var _getPrefix = function (itemName, action) {
        var messagePrefix = $filter('translate')('apps-common.errors.messagePrefix') + ' ';
        var actionName = actionsMap[action];

        if (itemName && actionName) {
          messagePrefix = $filter('translate')('apps-common.errors.actionFailed', {
            itemName: itemName,
            actionName: actionName
          }) + ' ';
        }

        return messagePrefix;
      };

      return function (itemName, action, e) {
        var messagePrefix = _getPrefix(itemName, action);
        var tryAgain = messagePrefix + $filter('translate')('apps-common.errors.tryAgain');
        var tryAgainReload = messagePrefix + $filter('translate')('apps-common.errors.tryAgainReload');
        var permissionRequired = $filter('translate')('apps-common.errors.permissionRequired');
        var checkConnection = messagePrefix + $filter('translate')('apps-common.errors.checkConnection');

        e = e || itemName;
        var error = getError(e);
        var errorString = error.message ? (messagePrefix + error.message) : tryAgain;

        // Attempt to internationalize Storage error
        var key = 'storage-client.error.' + (action ? action + '.' : '') + error.message;
        var msg = $filter('translate')(key);
        if (msg !== key) {
          errorString = msg;
        }

        if (!e) {
          return errorString;
        } else if (e.status === 400) {
          if (errorString.indexOf('is not editable') >= 0) {
            return errorString;
          } else if (errorString.indexOf('is required') >= 0) {
            return errorString;
          } else {
            return errorString;
          }
        } else if (e.status === 401) {
          return tryAgainReload;
        } else if (e.status === 403) {
          if (errorString.indexOf('User is not allowed access') >= 0) {
            return permissionRequired;
          } else if (errorString.indexOf('User does not have the necessary rights') >= 0) {
            return permissionRequired;
          } else if (errorString.indexOf('Premium Template requires Purchase') >= 0) {
            return permissionRequired;
          } else if (errorString.indexOf('Storage requires active subscription') >= 0) {
            return permissionRequired;
          } else {
            return errorString;
          }
        } else if (e.status === 404) {
          return tryAgain;
        } else if (e.status === 409) {
          return errorString;
        } else if (e.status === 500 || e.status === 503) {
          return tryAgain;
        } else if (e.status === -1 || error.code === -1 || error.code === 0) {
          return checkConnection;
        } else {
          return errorString;
        }
      };
    }
  ]);
