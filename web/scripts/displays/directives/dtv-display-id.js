'use strict';

angular.module('risevision.displays.directives')
  .directive('displayId', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-id.html',
        link: function ($scope) {
          $scope.factory = displayFactory;
          $scope.display = displayFactory.display;

          $scope.toggleEmailForm = function () {
            $scope.showEmailForm = !$scope.showEmailForm;
          };

        } //link()
      };
    }
  ]);
