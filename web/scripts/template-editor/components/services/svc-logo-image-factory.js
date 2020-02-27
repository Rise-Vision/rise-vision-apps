'use strict';

angular.module('risevision.template-editor.services')
  .factory('logoImageFactory', ['DEFAULT_IMAGE_THUMBNAIL', 'brandingFactory', '$modal', '$templateCache', '$q',
    function (DEFAULT_IMAGE_THUMBNAIL, brandingFactory, $modal, $templateCache, $q) {
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

      factory.getTransition = function () {
        return null;
      };

      factory.setDuration = function (duration) {
        return;
      };

      factory.setTransition = function (transition) {
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
        brandingFactory.setUnsavedChanges();
        return brandingFactory.brandingSettings.logoFileMetadata;
      };

      factory.getBlueprintData = function (key) {
        return null;
      };

      factory.areChecksCompleted = function (checksCompleted) {
        return !!brandingFactory.brandingSettings.logoFileMetadata;
      };

      factory._canRemoveImage = function () {
        var modalInstance = $modal.open({
          template: $templateCache.get('partials/template-editor/confirm-modal.html'),
          controller: 'confirmModalController',
          windowClass: 'primary-btn-danger madero-style centered-modal',
          resolve: {
            confirmationTitle: function () {
              return 'Are you sure you want to remove your logo?';
            },
            confirmationMessage: function () {
              return 'This will remove your logo from all Templates.';
            },
            confirmationButton: function () {
              return 'Yes, Remove It';
            },
            cancelButton: function () {
              return 'No, Keep It';
            }
          }
        });
        return modalInstance.result;
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
