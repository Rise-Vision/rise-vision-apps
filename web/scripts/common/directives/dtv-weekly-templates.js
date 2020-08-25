'use strict';

angular.module('risevision.apps.directives')
  .directive('weeklyTemplates', ['companyAssetsFactory', 'editorFactory', 'userState',
    '$sessionStorage',
    function (companyAssetsFactory, editorFactory, userState, $sessionStorage) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/common/weekly-templates.html',
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

          $scope.alreadyOptedIn = userState.getCopyOfProfile() && userState.getCopyOfProfile().mailSyncEnabled;

        } //link()
      };
    }
  ]);
