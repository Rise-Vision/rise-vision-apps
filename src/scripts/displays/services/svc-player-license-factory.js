'use strict';

angular.module('risevision.displays.services')
  .factory('playerLicenseFactory', ['userState', 'currentPlanFactory', 'confirmModal',
    'enableCompanyProduct', 'processErrorCode', '$log', 'PLAYER_PRO_PRODUCT_CODE', '$q',
    function (userState, currentPlanFactory, confirmModal, enableCompanyProduct, processErrorCode, $log,
      PLAYER_PRO_PRODUCT_CODE, $q) {
      var factory = {};

      factory.getUsedLicenseString = function () {
        var text = factory.getProUsedLicenseCount() + ' Licensed Display' + 
          (factory.getProUsedLicenseCount() !== 1 ? 's' : '') + ' / ';
        if (currentPlanFactory.isUnlimitedPlan()) {
          text += 'Unlimited Licenses';
        } else {
          text += factory.getProAvailableLicenseCount() +
            ' Available License' + (factory.getProAvailableLicenseCount() !== 1 ? 's' : '');
        }
        return text;
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
        return !currentPlanFactory.isUnlimitedPlan() && userState.hasRole('da') && ((display && display.playerProAuthorized) ||
          (factory.areAllProLicensesUsed(display) ? !currentPlanFactory.currentPlan.isPurchasedByParent : true));
      };

      factory.areAllProLicensesUsed = function (display) {
        var allLicensesUsed = !factory.getProAvailableLicenseCount();
        var allProLicensesUsed = allLicensesUsed && !(display && display.playerProAssigned);

        return factory.getProLicenseCount() > 0 && allProLicensesUsed;
      };

      factory.updateDisplayLicenseLocal = function (display) {
        var playerProAuthorized = display.playerProAuthorized;
        var company = userState.getCopyOfSelectedCompany(true);

        display.playerProAssigned = playerProAuthorized;
        display.playerProAuthorized = (display.originalPlayerProAuthorized || company
          .playerProAvailableLicenseCount > 0) && playerProAuthorized;
      };

      factory.updateDisplayLicense = function (display) {
        factory.apiError = '';
        factory.updatingLicense = true;

        var apiParams = {};
        var playerProAuthorized = display.playerProAuthorized;
        apiParams[display.id] = playerProAuthorized;

        return enableCompanyProduct(display.companyId, PLAYER_PRO_PRODUCT_CODE, apiParams)
          .then(function (resp) {
            var resultDisplays = resp && resp.item && resp.item.displays;
            if (resultDisplays && resultDisplays[display.id] === apiParams[display.id]) {
              factory.updateDisplayLicenseLocal(display);
              factory.toggleDisplayLicenseLocal(display.playerProAuthorized);
            } else {
              throw new Error('License could not be updated. Please try again.');
            }
          })
          .catch(function (e) {
            factory.apiError = processErrorCode(e);
            $log.error(factory.apiError, e);
            return $q.reject(e);
          })
          .finally(function () {
            factory.updatingLicense = false;
            if (!playerProAuthorized) {
              display.monitoringEnabled = false;
            }
          });
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
              currentPlanFactory.confirmAndPurchase(displayIds.length - factory.getProAvailableLicenseCount());
              return $q.reject();
            }
          });
      };

      factory.licenseDisplaysByCompanyId = function (companyId, displayIds) {
        var apiParams = {};
        for (var i = 0; i < displayIds.length; i++) {
          var displayId = displayIds[i];
          apiParams[displayId] = true;
        }

        return enableCompanyProduct(companyId, PLAYER_PRO_PRODUCT_CODE, apiParams)
          .then(function (resp) {
            var resultDisplays = resp && resp.item && resp.item.displays;
            var licensedCount = 0;
            for (var i = 0; i < displayIds.length; i++) {
              var displayId = displayIds[i];
              if (resultDisplays && resultDisplays[displayId] === true) {
                licensedCount++;
              }
            }

            factory.toggleDisplayLicenseLocal(true, licensedCount);

            if (licensedCount !== displayIds.length) {
              throw new Error('License could not be updated. Please try again.');
            }
          });
      };

      var _licenseDisplays = function (displayIds) {
        factory.apiError = '';
        factory.updatingLicense = true;

        return factory.licenseDisplaysByCompanyId(userState.getSelectedCompanyId(), displayIds)
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
