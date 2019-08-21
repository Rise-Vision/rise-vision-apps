'use strict';

angular.module('risevision.template-editor.services')
  .factory('baseImageFactory', ['fileMetadataUtilsService', 'blueprintFactory', 'templateEditorFactory',
    function (fileMetadataUtilsService, blueprintFactory, templateEditorFactory) {
      var factory = {};

      factory.componentId = null;

      factory.getImagesAsMetadata = function () {
        return _getAttributeData('metadata');
      };

      factory.getDuration = function () {
        return _getAttributeData('duration');
      };

      factory.setDuration = function (duration) {
        _setAttributeData('duration', duration);
      };

      factory.getBlueprintData = function (key) {
        return blueprintFactory.getBlueprintData(factory.componentId, key);
      };

      factory.areChecksCompleted = function (checksCompleted) {
        return !!checksCompleted && !!checksCompleted[factory.componentId];
      };

      factory.removeImage = function (image, currentMetadata) {
        var metadata =
          fileMetadataUtilsService.metadataWithFileRemoved(currentMetadata, image);

        if (metadata) {
          return factory.updateMetadata(metadata);
        }
      };

      factory.updateMetadata = function (metadata) {
        var selectedImages = angular.copy(metadata);
        var filesAttribute =
          fileMetadataUtilsService.filesAttributeFor(selectedImages);

        _setAttributeData('metadata', selectedImages);
        _setAttributeData('files', filesAttribute);

        return selectedImages;
      };

      var _getAttributeData = function (key) {
        return templateEditorFactory.getAttributeData(factory.componentId, key);
      };

      var _setAttributeData = function (key, value) {
        templateEditorFactory.setAttributeData(factory.componentId, key, value);
      };

      return factory;
    }
  ]);
