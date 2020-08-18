'use strict';

angular.module('risevision.displays.services')
  .factory('playerLicenseFactory', ['userState', 'currentPlanFactory', 'plansFactory', 'confirmModal', 'enableCompanyProduct', 'processErrorCode', '$log', 'PLAYER_PRO_PRODUCT_CODE',
    function (userState, currentPlanFactory, plansFactory, confirmModal, enableCompanyProduct, processErrorCode, $log, PLAYER_PRO_PRODUCT_CODE) {
      var factory = {};

      factory.hasProfessionalLicenses = function () {
        return currentPlanFactory.currentPlan.playerProTotalLicenseCount > 0;
      };

      factory.getProLicenseCount = function () {
        return currentPlanFactory.currentPlan.playerProTotalLicenseCount || 0;
      };

      factory.getProAvailableLicenseCount = function () {
        return currentPlanFactory.currentPlan.playerProAvailableLicenseCount || 0;
      };

      factory.getProUsedLicenseCount = function () {
        return factory.getProLicenseCount() - factory.getProAvailableLicenseCount();
      };

      factory.areAllProLicensesUsed = function () {
        return currentPlanFactory.currentPlan.playerProAvailableLicenseCount <= 0;
      };

      factory.toggleDisplayLicenseLocal = function (playerProAuthorized, displaysCount) {
        var count = displaysCount || 1;
        var company = userState.getCopyOfSelectedCompany(true);
        var availableLicenseCount = company.playerProAvailableLicenseCount || 0;

        if (playerProAuthorized) {
          availableLicenseCount = availableLicenseCount - count;
          availableLicenseCount = availableLicenseCount < 0 ? 0 : availableLicenseCount;
        } else {
          availableLicenseCount = availableLicenseCount + count;
        }

        company.playerProAvailableLicenseCount = availableLicenseCount;
        userState.updateCompanySettings(company);
      };

      factory.confirmAndLicense = function(displayIds) {
        var countText = displayIds.length+' display';
        countText += displayIds.length > 1 ? 's' : '';
        confirmModal( 'License '+ countText + '?',
          'You are about to assign licenses to '+countText+'. Would you like to proceed?',
          'Yes', 'No', 'madero-style centered-modal',
          'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
        .then(function() {
          console.log("THEN");
          if (factory.getProAvailableLicenseCount() >= displayIds.length) {
            console.log("licensing...");
            _licenseDisplays(displayIds).catch(function() {
              console.log("ERROR licensing - show popup?")
            });
          } else {
            plansFactory.confirmAndPurchase();
          }          
        });
      };

      var _licenseDisplays = function(displayIds) {
        console.log('License', displayIds);        
        factory.apiError = null;
        factory.updatingLicense = true;

        var apiParams = {};
        for (var i=0; i<displayIds.length; i++) {
          var displayId = displayIds[i];
          apiParams[displayId] = true;
        }

        return enableCompanyProduct(userState.getSelectedCompanyId(), PLAYER_PRO_PRODUCT_CODE, apiParams)
        .then(function () {
          factory.toggleDisplayLicenseLocal(true, displayIds.length);
        })
        .catch(function (e) {
          factory.apiError = processErrorCode(e);

          $log.error(factory.apiError, e);
        })
        .finally(function () {
          factory.updatingLicense = false;
        });
      }

      return factory;
    }
  ]);
