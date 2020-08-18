'use strict';

angular.module('risevision.displays.services')
  .factory('playerLicenseFactory', ['userState', 'currentPlanFactory',
    function (userState, currentPlanFactory) {
      var factory = {};

      factory.getUsedLicenseString = function() {
        return factory.getProUsedLicenseCount() +
          ' Licensed Display' + (factory.getProUsedLicenseCount() > 1 ? 's' : '') +
          ' | ' + factory.getProAvailableLicenseCount() +
          ' License' + (factory.getProAvailableLicenseCount() > 1 ? 's' : '') +
          ' Available';
      };
      
      factory.isProAvailable = function () {
        return factory.hasProfessionalLicenses() && factory.getProLicenseCount() > 0 && 
          factory.getProAvailableLicenseCount() > 0;
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
          (_areAllProLicensesUsed(display) ? !currentPlanFactory.currentPlan.isPurchasedByParent : true));
      };

      var _areAllProLicensesUsed = function (display) {
        var allLicensesUsed = !factory.getProAvailableLicenseCount();
        var allProLicensesUsed = allLicensesUsed && !(display && display.playerProAssigned);

        return factory.getProLicenseCount() > 0 && allProLicensesUsed;
      };

      factory.toggleDisplayLicenseLocal = function (playerProAuthorized) {
        var company = userState.getCopyOfSelectedCompany(true);
        var availableLicenseCount = company.playerProAvailableLicenseCount || 0;

        if (playerProAuthorized) {
          availableLicenseCount--;
          availableLicenseCount = availableLicenseCount < 0 ? 0 : availableLicenseCount;
        } else {
          availableLicenseCount++;
        }

        company.playerProAvailableLicenseCount = availableLicenseCount;
        userState.updateCompanySettings(company);
      };

      return factory;
    }
  ]);
