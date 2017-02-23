'use strict';

angular.module('risevision.apps.services')
  .factory('messageBox', ['$q', '$log', '$modal', '$templateCache',
    function ($q, $log, $modal, $templateCache) {
      return function (title, message, close) {
        var modalInstance = $modal.open({
          template: $templateCache.get('message-box/message-box.html'),
          controller: 'messageBoxInstance',
          windowClass: 'modal-custom',
          resolve: {
            title: function () {
              return title;
            },
            message: function () {
              return message;
            },
            button: function () {
              return close || 'common.close';
            }
          }
        });
      };
    }
  ]);
