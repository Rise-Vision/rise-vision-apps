'use strict';

angular.module('risevision.common.components.logging')
  .factory('batchOperationsTracker', ['userState', 'analyticsFactory',
    function (userState, analyticsFactory) {
      return function (eventName, operation, items, extraProperties) {
        if (eventName) {
          var properties = extraProperties || {};
          properties.operationName = operation.name;
          properties.itemsCount = items.length;
          properties.companyId = userState.getSelectedCompanyId();

          analyticsFactory.track(eventName, properties);
        }
      };
    }
  ]);
