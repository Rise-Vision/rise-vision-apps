'use strict';

angular.module('risevision.apps.services')
  .service('processErrorCode', ['$filter', function ($filter) {
    var actionsMap = {
      Get: 'loaded',
      Add: 'added',
      Update: 'updated',
      Delete: 'deleted',
      Publish: 'published',
      Restore: 'restored'
    };
    var tryAgainMessage = $filter('translate')('apps-common.errors.tryAgain');

    return function (itemName, action, e) {
      var actionName = actionsMap[action];
      var error = (e && e.result && e.result.error) || {};
      var errorString = error.message ? error.message : 'An Error has Occurred';
      var messagePrefix = $filter('translate')('apps-common.errors.actionFailed', {
        itemName: itemName,
        actionName: actionName
      });

      if (!e) {
        return errorString;
      } else if (e.status === 400) {
        if (errorString.indexOf('is not editable') >= 0) {
          return messagePrefix + ' ' + errorString;
        } else if (errorString.indexOf('is required') >= 0) {
          return messagePrefix + ' ' + errorString;
        } else {
          return messagePrefix + ' ' + tryAgainMessage;
        }
      } else if (e.status === 401) {
        return $filter('translate')('apps-common.errors.notAuthenticated', {
          itemName: itemName,
          actionName: action.toLowerCase()
        });
      } else if (e.status === 403) {
        if (errorString.indexOf('User is not allowed access') >= 0) {
          return messagePrefix + ' ' + $filter('translate')('apps-common.errors.parentCompanyAction');
        } else if (errorString.indexOf('User does not have the necessary rights') >= 0) {
          return messagePrefix + ' ' + $filter('translate')('apps-common.errors.permissionRequired');
        } else if (errorString.indexOf('Premium Template requires Purchase') >= 0) {
          return messagePrefix + ' ' + $filter('translate')('apps-common.errors.premiumTemplate');
        } else {
          return messagePrefix + ' ' + $filter('translate')('apps-common.errors.generalAccess');
        }
      } else if (e.status === 404) {
        return $filter('translate')('apps-common.errors.notFound', {
          itemName: itemName
        });
      } else if (e.status === 409) {
        return messagePrefix + ' ' + errorString;
      } else if (e.status === 500 || e.status === 503) {
        return $filter('translate')('apps-common.errors.notAuthenticated', {
          itemName: itemName,
          actionName: action.toLowerCase()
        }) + ' ' + tryAgainMessage;
      } else {
        return errorString;
      }
    };
  }]);
