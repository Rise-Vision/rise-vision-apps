'use strict';

angular.module('risevision.apps.directives')
  .directive('confirmEmail', ['userState', 'userauth', 'getError', 'messageBox',
    function (userState, userauth, getError, messageBox) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/confirm-email.html',
        link: function ($scope) {
          $scope.username = userState.getUsername();

          $scope.requestConfirmationEmail = function () {
            $scope.emailSending = true;
            return userauth.requestConfirmationEmail(userState.getUsername())
              .then(function () {
                $scope.emailSent = true;
              })
              .catch(function (e) {
                var errorMessage = 'Oops, an error occurred while trying to resend the confirmation email.';
                var error = getError(e);
                var apiError = error.message ||
                  'Please try again or <a target="_blank" href="mailto:support@risevision.com">reach out to our Support team</a> if the problem persists.';

                messageBox(errorMessage, apiError);
              })
              .finally(function () {
                $scope.emailSending = false;
              });
          };
        }
      };
    }
  ]);
