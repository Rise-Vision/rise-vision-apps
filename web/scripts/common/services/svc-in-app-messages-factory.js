'use strict';

angular.module('risevision.apps.services')
  .factory('inAppMessagesFactory', ['localStorageService', 'userState',
    function (localStorageService, userState) {
      var factory = {
        messageToShow: undefined
      };

      factory.pickMessage = function () {
        if (_shouldShowConfirmEmail()) {
          factory.messageToShow = 'confirmEmail';
        } else {
          factory.messageToShow = undefined;
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

      var _isDismissed = function (key) {
        return localStorageService.get(key + 'Alert.dismissed') === true;
      };

      return factory;
    }
  ]);
