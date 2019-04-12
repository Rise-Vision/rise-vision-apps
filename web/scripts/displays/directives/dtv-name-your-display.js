'use strict';

angular.module('risevision.displays.directives')
  .directive('nameYourDisplay', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/name-your-display.html',
        scope: true,
        link: function ($scope) {
          $scope.factory = displayFactory;

          $scope.save = function () {
            if (!$scope.forms.displayAdd.$valid) {
              return;
            }

            displayFactory.addDisplay().then(function () {
              $scope.setCurrentPage('displayAdded');
            });
          };

        } //link()
      };
    }
  ]);
