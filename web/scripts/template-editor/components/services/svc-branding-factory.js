'use strict';

angular.module('risevision.template-editor.services')
  .factory('brandingFactory', ['$q', 'blueprintFactory', 'userState', 'updateCompany',
    function ($q, blueprintFactory, userState, updateCompany) {
      var factory = {};

      var _hasBrandingElements = function () {
        var blueprint = blueprintFactory.blueprintData;

        return !!blueprint && blueprint.branding === true;
      };

      factory.getBrandingComponent = function () {
        if (_hasBrandingElements()) {
          return {
            type: 'rise-branding'
          };
        }

        return null;
      };

      var _updateCompanySettings = function (settings) {
        var companyPatch = {
          settings: settings
        };
        return updateCompany(userState.getSelectedCompanyId(), companyPatch)
          .then(function (updatedCompany) {
            userState.updateCompanySettings(updatedCompany);
          }).catch(function (err) {
            console.log('err', err);
          });
      };

      factory.publishBranding = function () {
        if (!factory.isRevised()) {
          console.log('Branding already published.');

          return $q.resolve();
        }

        var company = userState.getCopyOfSelectedCompany();

        return _updateCompanySettings({
          brandingLogoFile: company.settings.brandingDraftLogoFile,
          brandingPrimaryColor: company.settings.brandingDraftPrimaryColor,
          brandingSecondaryColor: company.settings.brandingDraftSecondaryColor,
          brandingDraftLogoFile: '',
          brandingDraftPrimaryColor: '',
          brandingDraftSecondaryColor: ''
        });
      };

      factory.updateDraftColors = function (primaryColor, secondaryColor) {
        return _updateCompanySettings({
          brandingDraftPrimaryColor: primaryColor,
          brandingDraftSecondaryColor: secondaryColor
        });
      };

      factory.updateDraftLogo = function (logoFile) {
        return _updateCompanySettings({
          brandingDraftLogoFile: logoFile
        });
      };

      factory.isRevised = function () {
        var company = userState.getCopyOfSelectedCompany();

        return company.settings && (company.settings.brandingDraftLogoFile ||
          company.settings.brandingDraftPrimaryColor || company.settings.brandingDraftPrimaryColor);
      };

      return factory;
    }
  ]);
