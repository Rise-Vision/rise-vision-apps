'use strict';

angular.module('risevision.template-editor.services')
  .factory('logoImageFactory', ['DEFAULT_IMAGE_THUMBNAIL', 'brandingFactory', '$q', 'ngModalService',
    function (DEFAULT_IMAGE_THUMBNAIL, brandingFactory, $q, ngModalService) {
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

      factory.setDuration = function (duration) {
        return;
      };

      factory.setTransition = function (transition) {
        return;
      };

      factory.getHelpText = function () {
        return null;
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
        brandingFactory.setUnsavedChanges();
        return brandingFactory.brandingSettings.logoFileMetadata;
      };

      factory.getAvailableAttributeData = function (key) {
        return null;
      };

      factory.getBlueprintData = function (key) {
        return null;
      };

      factory.areChecksCompleted = function () {
        return !!brandingFactory.brandingSettings.logoFileMetadata;
      };

      factory._canRemoveImage = function () {
        return ngModalService.confirmDanger('Are you sure you want to remove your logo?',
          'This will remove your logo from all Templates.',
          'Yes, Remove It',
          'No, Keep It'
        );
      };

      factory.removeImage = function (image, currentMetadata) {
        var deferred = $q.defer();

        factory._canRemoveImage().then(function () {
          deferred.resolve(factory.updateMetadata([]));
        }).catch(function () {
          deferred.resolve(currentMetadata);
        });

        return deferred.promise;
      };

      return factory;
    }
  ]);
