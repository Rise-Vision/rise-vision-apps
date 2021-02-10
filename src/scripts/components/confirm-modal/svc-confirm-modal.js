'use strict';

angular.module('risevision.common.components.confirm-modal.services', [
    'ui.bootstrap'
  ])
  .factory('confirmModal', ['$modal', '$templateCache',
    function ($modal, $templateCache) {
      return function (title, message, confirm, cancel, windowClass, templateUrl, size) {
        var options = {
          controller: 'confirmModalController',
          resolve: {
            confirmationTitle: function () {
              return title;
            },
            confirmationMessage: function () {
              return message;
            },
            confirmationButton: function () {
              return confirm;
            },
            cancelButton: function () {
              return cancel;
            }
          }
        };

        options.windowClass = windowClass || 'modal-custom';

        if (!templateUrl) {
          options.template = $templateCache.get('partials/components/confirm-modal/confirm-modal.html');
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
