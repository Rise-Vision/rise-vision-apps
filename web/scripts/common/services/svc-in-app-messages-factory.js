'use strict';

angular.module('risevision.apps.services')
  .factory('inAppMessagesFactory', ['localStorageService', 'userState', 'CachedRequest', 'presentation', '$q',
    function (localStorageService, userState, CachedRequest, presentation, $q) {
      var presentationListReq = new CachedRequest(presentation.list, {});
      var factory = {};

      factory.pickMessage = function () {
        return presentationListReq.execute().then(function (resp) {
          if (_shouldShowPricingChanges()) {
            return 'pricingChanges';
          } else if (_shouldShowPromoteTraining(resp.items)) {
            return 'promoteTraining';
          }
        });
      };

      factory.dismissMessage = function (message) {
        var alertDismissedKey = message + 'Alert.dismissed';
        localStorageService.set(alertDismissedKey, 'true');
      };

      var _shouldShowPricingChanges = function () {
        var company = userState.getCopyOfSelectedCompany();
        var creationDate = ((company && company.creationDate) ? (new Date(company.creationDate)) : (
          new Date()));
        var isPastCreationDate = creationDate < new Date('June 25, 2019');

        return isPastCreationDate && !_isDismissed('pricingChanges');
      };

      var _shouldShowPromoteTraining = function (presentations) {
        var hasAddedPresentation = presentations && presentations.length > 0;
        return hasAddedPresentation && !_isDismissed('promoteTraining');
      };

      var _isDismissed = function (key) {
        return localStorageService.get(key + 'Alert.dismissed') === 'true';
      };

      return factory;
    }
  ]);
