'use strict';

angular.module('risevision.displays.directives')
  .directive('nameYourDisplay', ['displayFactory',
    function (displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/name-your-display.html',
        link: function ($scope) {
          $scope.factory = displayFactory;
          $scope.display = displayFactory.display;

          $scope.save = function () {
            if (!$scope.forms.displayAdd.$valid) {
              return;
            }

            displayFactory.addDisplay().then(function () {
              $scope.display = displayFactory.display;

              $scope.setCurrentPage('displayAdded');
            });
          };

        } //link()
      };
    }
  ]);
