'use strict';

angular.module('risevision.apps.directives')
  .directive('confirmEmail', ['userState', 'userauth',
    function (userState, userauth) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/confirm-email.html',
        link: function ($scope) {
          $scope.username = userState.getUsername();

          $scope.requestConfirmationEmail = function() {
            userauth.requestConfirmationEmail(userState.getUsername())
              .then(function() {
                $scope.emailSent = true;
              })
              .catch(function(err) {
                
              });
          };
        }
      };
    }
  ]);
