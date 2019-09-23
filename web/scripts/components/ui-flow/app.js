'use strict';

angular.module('risevision.common.components.ui-flow', [
    'LocalStorageModule'
  ])

  .constant('uiStatusDependencies', {
    _dependencies: {},
    _retries: {},
    addDependencies: function (deps) {
      angular.extend(this._dependencies, deps);
    },
    setMaximumRetryCount: function (status, num) {
      if (num < 1) {
        throw 'Retry count for ' + status +
          ' must be equal to or greater than 1.';
      }
      if (this._retries[status] === undefined) {
        this._retries[status] = num;
      }
    }
  });
