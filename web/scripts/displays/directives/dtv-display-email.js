'use strict';

angular.module('risevision.displays.directives')
  .directive('displayEmail', ['$loading', 'displayEmail', 'processErrorCode',
    function ($loading, displayEmail, processErrorCode) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-email.html',
        scope: true,
        link: function ($scope) {
          $scope.email = null;
          $scope.displayEmail = displayEmail;

          $scope.$watch('displayEmail.sendingEmail', function (loading) {
            if (loading) {
              $loading.start('display-email');
            } else {
              $loading.stop('display-email');
            }
          });

          $scope.sendEmail = function () {
            $scope.emailSent = false;
            $scope.emailError = false;

            displayEmail.send($scope.display.id, $scope.email)
              .then(function () {
                $scope.emailSent = true;
                $scope.email = null;
                $scope.emailForm.$setPristine(true);
              })
              .catch(function (e) {
                $scope.emailError = processErrorCode(e);
              });
          };

        } //link()
      };
    }
  ]);
