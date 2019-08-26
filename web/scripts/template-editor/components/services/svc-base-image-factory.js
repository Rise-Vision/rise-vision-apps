'use strict';

angular.module('risevision.template-editor.services')
  .factory('baseImageFactory', ['fileMetadataUtilsService', 'blueprintFactory', 'templateEditorFactory', '$q',
    function (fileMetadataUtilsService, blueprintFactory, templateEditorFactory, $q) {
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
          return $q.resolve(factory.updateMetadata(metadata));
        } else {
          return $q.resolve([]);
        }
      };

      factory.updateMetadata = function (metadata) {
        var selectedImages = angular.copy(metadata);
        var filesAttribute =
          fileMetadataUtilsService.filesAttributeFor(selectedImages);

        _setAttributeData('metadata', selectedImages);
        _setAttributeData('files', filesAttribute);

        // Check default isLogo value; if the user selects their own image
        // set this component to use that image; if empty set it to use the 
        // Company Branding logo
        if (factory.getBlueprintData('is-logo') === 'true') {
          if (selectedImages && selectedImages.length > 0) {
            _setAttributeData('isLogo', false);
          } else {
            _setAttributeData('isLogo', true);
          }
        }

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
