'use strict';

angular.module('risevision.template-editor.services')
  .factory('brandingFactory', ['$rootScope', '$q', 'blueprintFactory', 'userState', 'updateCompany',
    'fileExistenceCheckService', 'DEFAULT_IMAGE_THUMBNAIL', 'REVISION_STATUS_REVISED', 'REVISION_STATUS_PUBLISHED',
    function ($rootScope, $q, blueprintFactory, userState, updateCompany, fileExistenceCheckService,
      DEFAULT_IMAGE_THUMBNAIL, REVISION_STATUS_REVISED, REVISION_STATUS_PUBLISHED) {
      var brandingComponent = {
        type: 'rise-branding'
      };
      var factory = {
        brandingSettings: null
      };

      var _refreshMetadata = function() {
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
        }

        _refreshMetadata();
      };

      $rootScope.$on('risevision.company.updated', function () {
        _loadBranding(true);
      });

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

      factory.updateDraftColors = function () {
        return _updateCompanySettings({
          brandingDraftBaseColor: factory.brandingSettings.baseColor,
          brandingDraftAccentColor: factory.brandingSettings.accentColor,
          brandingRevisionStatusName: REVISION_STATUS_REVISED
        });
      };

      factory.updateDraftLogo = function () {
        return _updateCompanySettings({
          brandingDraftLogoFile: factory.brandingSettings.logoFile,
          brandingRevisionStatusName: REVISION_STATUS_REVISED
        });
      };

      factory.isRevised = function () {
        var company = userState.getCopyOfSelectedCompany();

        return !!(company.settings && company.settings.brandingRevisionStatusName === REVISION_STATUS_REVISED);
      };

      return factory;
    }
  ]);
