'use strict';

angular.module('risevision.template-editor.services')
  .factory('logoImageFactory', ['userState', 'fileExistenceCheckService', 'DEFAULT_IMAGE_THUMBNAIL', 'brandingFactory',
    function (userState, fileExistenceCheckService, DEFAULT_IMAGE_THUMBNAIL, brandingFactory) {
      var factory = {};

      factory.getImagesAsMetadata = function () {

        var company = userState.getCopyOfSelectedCompany();
        var logo = company.settings && company.settings.brandingDraftLogoFile;
        // if (logo) {
        return [{
          exists: true,
          file: logo,
          'thumbnail-url': DEFAULT_IMAGE_THUMBNAIL,
          // "time-created": "1565380652872"
        }];

        // fileExistenceCheckService.requestMetadataFor([logo], DEFAULT_IMAGE_THUMBNAIL)
        //   .then(function (metadata) {
        //     console.log('received metadata', metadata);
        //   })
        //   .catch(function (error) {
        //     console.error('Could not check file existence for: ' + logo, error);
        //   });
        // }        
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
          brandingFactory.updateDraftLogo(item.file);
          return [item];
        } else {
          brandingFactory.updateDraftLogo('');
          return [];
        }
      };

      factory.getBlueprintData = function (key) {
        return [];
      };

      factory.areChecksCompleted = function (checksCompleted) {
        return true;
      };

      factory.removeImage = function (image, currentMetadata) {
        brandingFactory.updateDraftLogo('');
        return [];
      };

      return factory;
    }
  ]);
