'use strict';

angular.module('risevision.apps.directives')
  .directive('pricingChangesMessage', ['localStorageService', 'userState',
    function (localStorageService, userState) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/pricing-changes-message.html',
        link: function ($scope) {
          var alertDismissedKey = 'pricingChangesAlert.dismissed';
          var alertDismissed = localStorageService.get(alertDismissedKey) === 'true';
          var isPastCreationDate = false;

          var _checkCreationDate = function () {
            var company = userState.getCopyOfSelectedCompany();
            var creationDate = ((company && company.creationDate) ? (new Date(company.creationDate)) : (
            new Date()));

            isPastCreationDate = creationDate < new Date('June 25, 2019');
          };

          _checkCreationDate();

          $scope.$on('risevision.company.selectedCompanyChanged', _checkCreationDate);

          $scope.alertVisible = function () {
            return !alertDismissed && isPastCreationDate;
          };

          $scope.dismissAlert = function () {
            alertDismissed = true;
            localStorageService.set(alertDismissedKey, 'true');
          };
        }
      };
    }
  ]);
