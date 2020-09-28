'use strict';

angular.module('risevision.displays.services')
  .factory('playerLicenseFactory', ['userState', 'currentPlanFactory', 'plansFactory', 'confirmModal',
    'enableCompanyProduct', 'processErrorCode', '$log', 'PLAYER_PRO_PRODUCT_CODE', '$q',
    function (userState, currentPlanFactory, plansFactory, confirmModal, enableCompanyProduct, processErrorCode, $log,
      PLAYER_PRO_PRODUCT_CODE, $q) {
      var factory = {};

      factory.getUsedLicenseString = function () {
        return factory.getProUsedLicenseCount() +
          ' Licensed Display' + (factory.getProUsedLicenseCount() !== 1 ? 's' : '') +
          ' / ' + factory.getProAvailableLicenseCount() +
          ' License' + (factory.getProAvailableLicenseCount() !== 1 ? 's' : '') +
          ' Available';
      };

      factory.isProAvailable = function (display) {
        return factory.hasProfessionalLicenses() && factory.getProLicenseCount() > 0 &&
          !factory.areAllProLicensesUsed(display);
      };

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

      factory.isProToggleEnabled = function (display) {
        return userState.hasRole('da') && ((display && display.playerProAuthorized) ||
          (factory.areAllProLicensesUsed(display) ? !currentPlanFactory.currentPlan.isPurchasedByParent : true));
      };

      factory.areAllProLicensesUsed = function (display) {
        var allLicensesUsed = !factory.getProAvailableLicenseCount();
        var allProLicensesUsed = allLicensesUsed && !(display && display.playerProAssigned);

        return factory.getProLicenseCount() > 0 && allProLicensesUsed;
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

      factory.confirmAndLicense = function (displayIds) {
        var countText = displayIds.length + ' display' + (displayIds.length > 1 ? 's' : '');
        return confirmModal('License ' + countText + '?',
            'You are about to assign licenses to ' + countText + '. Would you like to proceed?',
            'Yes', 'No', 'madero-style centered-modal',
            'partials/components/confirm-modal/madero-confirm-modal.html', 'sm')
          .then(function () {
            if (factory.getProAvailableLicenseCount() >= displayIds.length) {
              return _licenseDisplays(displayIds);
            } else {
              plansFactory.confirmAndPurchase();
              return $q.reject();
            }
          });
      };

      var _licenseDisplays = function (displayIds) {
        factory.apiError = '';
        factory.updatingLicense = true;

        var apiParams = {};
        for (var i = 0; i < displayIds.length; i++) {
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
            return $q.reject(e);
          })
          .finally(function () {
            factory.updatingLicense = false;
          });
      };

      return factory;
    }
  ]);
