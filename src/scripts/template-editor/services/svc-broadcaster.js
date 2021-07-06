'use strict';

angular.module('risevision.template-editor.services')
  .factory('broadcaster', ['$rootScope', 'ngBroadcaster',
    function ($rootScope, ngBroadcaster) {
      return {
        emit: function(event, details) {
          $rootScope.$broadcast(event, details);
          ngBroadcaster.emit(event);
        },
        subscribe: ngBroadcaster.subscribe
      };
    }
  ]);
