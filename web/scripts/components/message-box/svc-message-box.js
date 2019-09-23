'use strict';

angular.module('risevision.common.components.message-box.services', [])
  .factory('messageBox', ['$modal', '$templateCache',
    function ($modal, $templateCache) {
      return function (title, message, close, windowClass, templateUrl) {
        var options = {
          controller: 'messageBoxInstance',
          size: 'md',
          resolve: {
            title: function () {
              return title;
            },
            message: function () {
              return message;
            },
            button: function () {
              return close || 'common.ok';
            }
          }
        };

        if (windowClass) {
          options.windowClass = windowClass;
        }

        if (!templateUrl) {
          options.template = $templateCache.get('partials/components/message-box/message-box.html');
        } else {
          options.templateUrl = templateUrl;
        }

        return $modal.open(options);
      };
    }
  ]);
