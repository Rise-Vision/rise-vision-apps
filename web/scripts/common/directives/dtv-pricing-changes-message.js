'use strict';

angular.module('risevision.apps.directives')
  .directive('pricingChangesMessage', ['localStorageService', function (localStorageService) {
    return {
      restrict: 'E',
      templateUrl: 'partials/common/pricing-changes-message.html',
      link: function ($scope) {
        var alertDismissedKey = 'pricingChangesAlert.dismissed';

        $scope.alertVisible = localStorageService.get(alertDismissedKey) !== 'true';

        $scope.dismissAlert = function () {
          $scope.alertVisible = false;
          localStorageService.set(alertDismissedKey, 'true');
        };
      }
    };
  }]);
