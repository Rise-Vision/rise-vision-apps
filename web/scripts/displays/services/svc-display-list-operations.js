'use strict';

angular.module('risevision.displays.services')
  .service('DisplayListOperations', ['displayFactory',
    function (displayFactory) {
      return function () {
        var listOperations = {
          name: 'Display',
          operations: [{
            name: 'Delete',
            actionCall: displayFactory.deleteDisplayByObject,
            requireRole: 'da'
          }]
        };

        return listOperations;
      };
    }
  ]);
