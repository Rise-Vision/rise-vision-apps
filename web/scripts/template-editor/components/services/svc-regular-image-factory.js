'use strict';

angular.module('risevision.template-editor.services')
  .factory('regularImageFactory', ['fileMetadataUtilsService', 'blueprintFactory', 'templateEditorFactory',
    function (fileMetadataUtilsService, blueprintFactory, templateEditorFactory) {
      var factory = {};

      factory.componentId = null;

      factory.getAttributeData = function (key) {
        return templateEditorFactory.getAttributeData(factory.componentId, key);
      };

      factory.getBlueprintData = function (key) {        
        return blueprintFactory.getBlueprintData(factory.componentId, key);
      };

      factory.setAttributeData = function (key, value) {
        templateEditorFactory.setAttributeData(factory.componentId, key, value);
      };

      factory.areChecksCompleted = function (checksCompleted) {
        return checksCompleted && checksCompleted[factory.componentId];
      };

      factory.removeImage = function(image, currentMetadata) {
          var metadata =
            fileMetadataUtilsService.metadataWithFileRemoved(currentMetadata, image);

          if (metadata) {
            return factory.handleMetadata(metadata);
          }
      };

      factory.handleMetadata = function(metadata) {
          var selectedImages = angular.copy(metadata);
          var filesAttribute =
            fileMetadataUtilsService.filesAttributeFor(selectedImages);

          factory.setAttributeData('metadata', selectedImages);
          factory.setAttributeData('files', filesAttribute);

          return selectedImages;
      };

      return factory;
    }
  ]);
