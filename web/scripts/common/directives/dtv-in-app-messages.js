'use strict';

angular.module('risevision.apps.directives')
  .directive('inAppMessages', ['localStorageService', 'userState',
    function (localStorageService, userState) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/in-app-messages.html',
        link: function ($scope) {
          $scope.messageToShow = undefined;

          var _isDismissed = function (key) {
            return localStorageService.get(key + 'Alert.dismissed') === 'true';
          };

          var _shouldShowPricingChanges = function () {
            var company = userState.getCopyOfSelectedCompany();
            var creationDate = ((company && company.creationDate) ? (new Date(company.creationDate)) : (
              new Date()));
            var isPastCreationDate = creationDate < new Date('June 25, 2019');

            return isPastCreationDate && !_isDismissed('pricingChanges');
          };

          var _shouldShowPromoteTraining = function () {
            var hasAddedPresentation = true;
            return hasAddedPresentation && !_isDismissed('promoteTraining');
          };

          var _pickMessage = function () {
            if (_shouldShowPricingChanges()) {
              $scope.messageToShow = 'pricingChanges';
            } else if (_shouldShowPromoteTraining()) {
              $scope.messageToShow = 'promoteTraining';
            }
          };
          _pickMessage();

          $scope.$on('risevision.company.selectedCompanyChanged', _pickMessage);

          $scope.dismissMessage = function () {
            var alertDismissedKey = $scope.messageToShow + 'Alert.dismissed';
            localStorageService.set(alertDismissedKey, 'true');
            $scope.messageToShow = undefined;
          };
        }
      };
    }
  ]);
