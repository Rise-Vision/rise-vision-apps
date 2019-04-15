'use strict';

angular.module('risevision.displays.directives')
  .directive('nameYourDisplay', ['$loading', 'displayFactory',
    function ($loading, displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/name-your-display.html',
        scope: true,
        link: function ($scope) {
          $scope.factory = displayFactory;

          $scope.$watch('factory.savingDisplay', function (loading) {
            if (loading) {
              $loading.start('name-your-display');
            } else {
              $loading.stop('name-your-display');
            }
          });

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
