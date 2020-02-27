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

      factory.getTransition = function () {
        return _getAttributeData('transition');
      };

      factory.setDuration = function (duration) {
        _setAttributeData('duration', duration);
      };

      factory.setTransition = function (transition) {
        _setAttributeData('transition', transition);
      };

      factory.getBlueprintData = function (key) {
        return blueprintFactory.getBlueprintData(factory.componentId, key);
      };

      factory.areChecksCompleted = function (checksCompleted) {
        return !!checksCompleted && !!checksCompleted[factory.componentId];
      };

      factory.isSetAsLogo = function () {
        return factory.getBlueprintData('is-logo') === 'true' && _getAttributeData('isLogo') !== false;
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

        // Check default isLogo===true value; if the user makes changes to the component
        // revert it to isLogo=false
        if (factory.getBlueprintData('is-logo') === 'true') {
          _setAttributeData('isLogo', false);
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
