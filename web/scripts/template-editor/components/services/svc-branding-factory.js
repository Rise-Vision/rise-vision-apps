'use strict';

angular.module('risevision.template-editor.services')
  .factory('brandingFactory', ['$rootScope', '$q', 'blueprintFactory', 'userState', 'updateCompany',
    'fileExistenceCheckService', 'DEFAULT_IMAGE_THUMBNAIL',
    function ($rootScope, $q, blueprintFactory, userState, updateCompany, fileExistenceCheckService,
      DEFAULT_IMAGE_THUMBNAIL) {
      var brandingComponent = {
        type: 'rise-branding'
      };
      var factory = {
        brandingSettings: null
      };

      var _loadBranding = function (forceRefresh) {
        if (!factory.brandingSettings || forceRefresh) {
          var company = userState.getCopyOfSelectedCompany();
          var settings = company.settings || {};

          if (factory.isRevised()) {
            factory.brandingSettings = {
              logoFile: settings.brandingDraftLogoFile,
              baseColor: settings.brandingDraftBaseColor,
              accentColor: settings.brandingDraftAccentColor
            };            
          } else {
            factory.brandingSettings = {
              logoFile: settings.brandingLogoFile,
              baseColor: settings.brandingBaseColor,
              accentColor: settings.brandingAccentColor
            };
          }

          if (factory.brandingSettings.logoFile) {
            fileExistenceCheckService.requestMetadataFor([factory.brandingSettings.logoFile], DEFAULT_IMAGE_THUMBNAIL)
              .then(function (metadata) {
                factory.brandingSettings.logoFileMetadata = metadata;
              })
              .catch(function (error) {
                console.error('Could not load metadata for: ' + factory.brandingSettings.logoFile, error);
              });            
          } else {
            factory.brandingSettings.logoFileMetadata = [];
          }
        }
      };

      $rootScope.$on('risevision.company.updated', function () {
        _loadBranding(true);
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function() {
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
          brandingDraftLogoFile: '',
          brandingDraftBaseColor: '',
          brandingDraftAccentColor: ''
        });
      };

      factory.updateDraftColors = function () {
        return _updateCompanySettings({
          brandingDraftBaseColor: factory.brandingSettings.baseColor,
          brandingDraftAccentColor: factory.brandingSettings.accentColor
        });
      };

      factory.updateDraftLogo = function () {
        return _updateCompanySettings({
          brandingDraftLogoFile: factory.brandingSettings.logoFile
        });
      };

      factory.isRevised = function () {
        var company = userState.getCopyOfSelectedCompany();

        return !!(company.settings && (company.settings.brandingDraftLogoFile ||
          company.settings.brandingDraftBaseColor || company.settings.brandingDraftAccentColor));
      };

      return factory;
    }
  ]);
