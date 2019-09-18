'use strict';

angular.module('risevision.apps.directives')
  .directive('inAppMessages', ['inAppMessagesFactory',
    function (inAppMessagesFactory) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/in-app-messages.html',
        link: function ($scope) {

          inAppMessagesFactory.pickMessage().then(function (result) {
            $scope.messageToShow = result;
          });

          $scope.dismissMessage = function () {
            inAppMessagesFactory.dismissMessage($scope.messageToShow);
            $scope.messageToShow = undefined;
          };
        }
      };
    }
  ]);
