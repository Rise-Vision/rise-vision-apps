'use strict';

angular.module('risevision.displays.directives')
  .directive('sendAnotherEmail', ['$filter', 'displayEmail',
    function ($filter, displayEmail) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/send-another-email.html',
        scope: true,
        link: function ($scope) {
          $scope.anotherEmail = null;

          $scope.sendToAnotherEmail = function () {
            $scope.errorMessage = null;
            displayEmail.send($scope.display.id, $scope.anotherEmail)
              .then(function () {
                $scope.anotherEmail = null;
                $scope.anotherEmailForm.$setPristine(true);
              }, function (error) {
                $scope.errorMessage = $filter('translate')('displays-app.fields.email.failed');
              });
          };

        } //link()
      };
    }
  ]);
