'use strict';

angular.module('risevision.storage.services')
  .factory('uploadOverwriteWarning', ['$q', '$templateCache', '$modal',
    function ($q, $templateCache, $modal) {
      var factory = {};

      factory.checkOverwrite = function (resp, isMaderoStyle) {
        if (resp.isOverwrite === true) {
          //multiple uploads can trigger the modal, they should all use the same instance
          if (!factory.confirmOverwriteModal) {
            factory.confirmOverwriteModal = $modal.open({
              template: $templateCache.get(isMaderoStyle ?
                'partials/components/confirm-modal/madero-confirm-danger-modal.html' :
                'partials/components/confirm-modal/confirm-modal.html'),
              controller: 'confirmModalController',
              windowClass: isMaderoStyle ?
                'madero-style centered-modal' : 'modal-custom confirm-overwrite-modal',
              resolve: {
                confirmationTitle: function () {
                  return isMaderoStyle ? 'Are you sure you want to overwrite your files?' : 'Warning';
                },
                confirmationMessage: function () {
                  var baseMessage =
                    'There is a file or folder in this folder with the same name as the one(s) you are trying to upload.<br/>Uploading these new files or folder will cause the existing ones to be overwritten and could change the content on your Displays.';
                  return isMaderoStyle ? baseMessage : baseMessage +
                    '<br/>Are you sure you want to overwrite your files?';
                },
                confirmationButton: function () {
                  return 'Yes, overwrite files';
                },
                cancelButton: function () {
                  return 'No, keep source files';
                }
              }
            });
          }
          return factory.confirmOverwriteModal.result;
        } else {
          return $q.resolve();
        }
      };

      factory.resetConfirmation = function () {
        factory.confirmOverwriteModal = undefined;
      };

      return factory;
    }
  ]);
