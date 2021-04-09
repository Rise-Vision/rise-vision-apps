'use strict';

angular.module('risevision.template-editor.services')
  .factory('storageManagerFactory', ['storage', 'templateEditorUtils',
    'SUPPORTED_IMAGE_TYPES', 'SUPPORTED_VIDEO_TYPES',
    function (storage, templateEditorUtils, SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES) {
      var factory = {
        isListView: true
      };

      var _getValidExtensionsList = function() {
        var validExtensions = factory.fileType === 'image' ? SUPPORTED_IMAGE_TYPES : SUPPORTED_VIDEO_TYPES;

        return validExtensions ? validExtensions.split(',') : [];
      };

      factory.loadFiles = function(newFolderPath) {
        factory.loadingFiles = true;
        factory.folderItems = undefined;

        return storage.files.get({
            folderPath: newFolderPath
          })
          .then(function (items) {
            if (items.files) {
              factory.folderItems = items.files.filter(function (item) {
                var isValid = templateEditorUtils.fileHasValidExtension(item.name, _getValidExtensionsList());

                return item.name !== newFolderPath && (templateEditorUtils.isFolder(item.name) || isValid);
              });
            } else {
              factory.folderItems = [];
            }

            return factory.folderItems;
          })
          .catch(function (err) {
            console.log('Failed to load files', err);
          })
          .finally(function () {
            factory.loadingFiles = false;
          });
      };

      return factory;
    }
  ]);
