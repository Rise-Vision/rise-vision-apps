'use strict';

angular.module('risevision.apps.services')
  .factory('inAppMessagesFactory', ['localStorageService', 'userState', 'companyAssetsFactory', '$q',
    '$rootScope',
    function (localStorageService, userState, companyAssetsFactory, $q, $rootScope) {
      var factory = {
        messageToShow: undefined
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _reset();
      });

      factory.pickMessage = function (forceReload) {
        if (_shouldShowConfirmEmail()) {
          factory.messageToShow = 'confirmEmail';
        } else {
          companyAssetsFactory.hasPresentations(forceReload).then(function (hasAddedPresentation) {
            if (_shouldShowPromoteTraining(hasAddedPresentation)) {
              factory.messageToShow = 'promoteTraining';
            } else {
              factory.messageToShow = undefined;
            }
          });
        }
      };

      factory.canDismiss = function () {
        return (factory.messageToShow !== 'confirmEmail');
      };

      factory.dismissMessage = function () {
        if (!factory.messageToShow) {
          return;
        }
        var alertDismissedKey = factory.messageToShow + 'Alert.dismissed';
        localStorageService.set(alertDismissedKey, true);
        factory.messageToShow = undefined;
      };

      var _reset = function () {
        factory.messageToShow = undefined;
        factory.pickMessage(true);
      };

      var _shouldShowConfirmEmail = function () {
        var userProfile = userState.getCopyOfProfile();

        return userState.isRiseAuthUser() && userProfile ? (userProfile.userConfirmed === false) : false;
      };

      var _shouldShowPromoteTraining = function (hasAddedPresentation) {
        return hasAddedPresentation && !_isDismissed('promoteTraining');
      };

      var _isDismissed = function (key) {
        return localStorageService.get(key + 'Alert.dismissed') === true;
      };

      return factory;
    }
  ]);
