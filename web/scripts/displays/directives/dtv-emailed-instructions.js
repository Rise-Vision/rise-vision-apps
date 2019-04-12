'use strict';

angular.module('risevision.displays.directives')
  .directive('emailedInstructions', ['userState',
    function (userState) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/emailed-instructions.html',
        link: function ($scope) {
          $scope.userEmail = userState.getUserEmail();
        } //link()
      };
    }
  ]);
