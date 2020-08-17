'use strict';

angular.module('risevision.common.components.message-box.services', [
    'ui.bootstrap'
  ])
  .factory('messageBox', ['$modal', '$templateCache',
    function ($modal, $templateCache) {
      return function (title, message, close, windowClass, templateUrl, size) {
        var options = {
          controller: 'messageBoxController',
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

        if (size) {
          options.size = size;
        }

        return $modal.open(options).result;
      };
    }
  ]);
