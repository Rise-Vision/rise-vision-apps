'use strict';

angular.module('risevision.displays.directives')
  .directive('sendAnotherEmail', ['$filter', '$loading', 'displayEmail',
    function ($filter, $loading, displayEmail) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/send-another-email.html',
        scope: true,
        link: function ($scope) {
          $scope.anotherEmail = null;
          $scope.displayEmail = displayEmail;

          $scope.$watch('displayEmail.sendingEmail', function (loading) {
            if (loading) {
              $loading.start('send-another-email');
            } else {
              $loading.stop('send-another-email');
            }
          });

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
