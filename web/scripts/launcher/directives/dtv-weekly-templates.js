'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('weeklyTemplates', ['productsFactory', 'ScrollingListService',
    'editorFactory', 'userState', '$sessionStorage',
    function (productsFactory, ScrollingListService, editorFactory,
      userState, $sessionStorage) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/launcher/weekly-templates.html',
        link: function ($scope) {
          $sessionStorage.$default({
            weeklyTemplatesFullView: true
          });

          $scope.fullView = $sessionStorage.weeklyTemplatesFullView;

          $scope.search = {
            // sortBy: 'templateReleaseDate DESC',
            filter: 'templateOfTheWeek:1',
            category: 'Templates',
            count: 4
          };

          if (userState.isEducationCustomer()) {
            $scope.factory = new ScrollingListService(productsFactory.loadProducts,
              $scope.search);
          }

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
