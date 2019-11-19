'use strict';

angular.module('risevision.apps.directives')
  .directive('inAppMessages', ['inAppMessagesFactory',
    function (inAppMessagesFactory) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/in-app-messages.html',
        link: function ($scope) {
          $scope.inAppMessagesFactory = inAppMessagesFactory;
          inAppMessagesFactory.pickMessage();
        }
      };
    }
  ]);
