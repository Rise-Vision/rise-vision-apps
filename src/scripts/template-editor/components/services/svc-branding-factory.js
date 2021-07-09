'use strict';

angular.module('risevision.template-editor.services')
  .factory('brandingFactory', ['$rootScope', '$q', 'broadcaster', 'blueprintFactory', 'userState', 'updateCompany',
    'fileExistenceCheckService', 'DEFAULT_IMAGE_THUMBNAIL', 'REVISION_STATUS_REVISED', 'REVISION_STATUS_PUBLISHED',
    function ($rootScope, $q, broadcaster, blueprintFactory, userState, updateCompany, fileExistenceCheckService,
      DEFAULT_IMAGE_THUMBNAIL, REVISION_STATUS_REVISED, REVISION_STATUS_PUBLISHED) {
      var brandingComponent = {
        type: 'rise-branding'
      };
      var factory = {
        brandingSettings: null,
        hasUnsavedChanges: false
      };

      var _refreshMetadata = function () {
        if (factory.brandingSettings.logoFile) {
          fileExistenceCheckService.requestMetadataFor([factory.brandingSettings.logoFile],
              DEFAULT_IMAGE_THUMBNAIL)
            .then(function (metadata) {
              factory.brandingSettings.logoFileMetadata = metadata;
            })
            .catch(function (error) {
              console.error('Could not load metadata for: ' + factory.brandingSettings.logoFile, error);
            });
        } else {
          factory.brandingSettings.logoFileMetadata = [];
        }
      };

      var _loadBranding = function (forceRefresh) {
        if (!factory.brandingSettings || forceRefresh) {
          var company = userState.getCopyOfSelectedCompany();
          var settings = company.settings || {};

          factory.brandingSettings = {
            logoFile: settings.brandingDraftLogoFile,
            baseColor: settings.brandingDraftBaseColor,
            accentColor: settings.brandingDraftAccentColor
          };
          factory.hasUnsavedChanges = false;
        }

        _refreshMetadata();
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _loadBranding(true);
      });

      factory.getBrandingComponent = function () {
        _loadBranding();

        return (blueprintFactory.hasBranding() ? brandingComponent : null);
      };

      var _updateCompanySettings = function (settings) {
        var companyPatch = {
          settings: settings
        };
        return updateCompany(userState.getSelectedCompanyId(), companyPatch)
          .then(function (updatedCompany) {
            userState.updateCompanySettings(updatedCompany);
          });
      };

      factory.publishBranding = function () {
        if (!factory.isRevised()) {
          //Branding already published.
          return $q.resolve();
        }

        var company = userState.getCopyOfSelectedCompany();

        return _updateCompanySettings({
          brandingLogoFile: company.settings.brandingDraftLogoFile,
          brandingBaseColor: company.settings.brandingDraftBaseColor,
          brandingAccentColor: company.settings.brandingDraftAccentColor,
          brandingRevisionStatusName: REVISION_STATUS_PUBLISHED
        });
      };

      factory.saveBranding = function () {
        if (!factory.hasUnsavedChanges || !blueprintFactory.hasBranding()) {
          return $q.resolve();
        }

        return _updateCompanySettings({
          brandingDraftBaseColor: factory.brandingSettings.baseColor,
          brandingDraftAccentColor: factory.brandingSettings.accentColor,
          brandingDraftLogoFile: factory.brandingSettings.logoFile,
          brandingRevisionStatusName: REVISION_STATUS_REVISED
        }).then(function () {
          factory.hasUnsavedChanges = false;
        });
      };

      factory.setUnsavedChanges = function () {
        broadcaster.emit('risevision.template-editor.brandingUnsavedChanges');

        this.hasUnsavedChanges = true;
      };

      factory.isRevised = function () {
        if (!blueprintFactory.hasBranding()) {
          return false;
        }

        var company = userState.getCopyOfSelectedCompany();

        return !!(company.settings && company.settings.brandingRevisionStatusName === REVISION_STATUS_REVISED);
      };

      return factory;
    }
  ]);
