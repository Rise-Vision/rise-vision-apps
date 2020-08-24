'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('weeklyTemplates', ['companyAssetsFactory', 'editorFactory', '$sessionStorage',
    function (companyAssetsFactory, editorFactory, $sessionStorage) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/launcher/weekly-templates.html',
        link: function ($scope) {
          $sessionStorage.$default({
            weeklyTemplatesFullView: true
          });

          $scope.weeklyTemplates = companyAssetsFactory.weeklyTemplates;

          $scope.fullView = $sessionStorage.weeklyTemplatesFullView;

          $scope.toggleView = function () {
            $scope.fullView = !$scope.fullView;
            $sessionStorage.weeklyTemplatesFullView = $scope.fullView;
          };

          $scope.select = function (product) {
            editorFactory.addFromProduct(product);
          };

        } //link()
      };
    }
  ]);
