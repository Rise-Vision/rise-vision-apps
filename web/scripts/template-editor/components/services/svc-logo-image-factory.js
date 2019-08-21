'use strict';

angular.module('risevision.template-editor.services')
  .factory('logoImageFactory', ['DEFAULT_IMAGE_THUMBNAIL', 'brandingFactory',
    function (DEFAULT_IMAGE_THUMBNAIL, brandingFactory) {
      var factory = {};

      factory.getImagesAsMetadata = function () {
        if (brandingFactory.brandingSettings.logoFile) {
          return brandingFactory.brandingSettings.logoFileMetadata ?
            brandingFactory.brandingSettings.logoFileMetadata : [{
              exists: true,
              file: brandingFactory.brandingSettings.logoFile,
              'thumbnail-url': DEFAULT_IMAGE_THUMBNAIL,
              'time-created': '0'
            }];
        } else {
          return [];
        }
      };

      factory.getDuration = function () {
        return null;
      };

      factory.setDuration = function (duration) {
        return;
      };

      factory.updateMetadata = function (metadata) {
        if (metadata && metadata.length > 0) {
          var item = metadata[metadata.length - 1];
          brandingFactory.brandingSettings.logoFileMetadata = [item];
          brandingFactory.brandingSettings.logoFile = item.file;
        } else {
          brandingFactory.brandingSettings.logoFileMetadata = [];
          brandingFactory.brandingSettings.logoFile = '';
        }
        brandingFactory.updateDraftLogo();
        return brandingFactory.brandingSettings.logoFileMetadata;
      };

      factory.getBlueprintData = function (key) {
        return null;
      };

      factory.areChecksCompleted = function (checksCompleted) {
        return !!brandingFactory.brandingSettings.logoFileMetadata;
      };

      factory.removeImage = function (image, currentMetadata) {
        return factory.updateMetadata([]);
      };

      return factory;
    }
  ]);
