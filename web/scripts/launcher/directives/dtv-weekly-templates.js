'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('weeklyTemplates', ['$loading', 'productsFactory', 'ScrollingListService', 'presentationUtils',
    'editorFactory', 'templateEditorFactory',
    function ($loading, productsFactory, ScrollingListService, presentationUtils, editorFactory,
      templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/launcher/weekly-templates.html',
        link: function ($scope) {

          $scope.search = {
            // sortBy: 'templateReleaseDate DESC',
            query: 'templateOfTheWeek:1',
            category: 'Templates',
            count: 4
          };

          $scope.factory = new ScrollingListService(productsFactory.loadProducts,
            $scope.search);

          $scope.$watch('factory.loadingItems', function (loading) {
            if (loading) {
              $loading.start('weekly-templates');
            } else {
              $loading.stop('weekly-templates');
            }
          });

          $scope.select = function (product) {
            if (!presentationUtils.isHtmlTemplate(product)) {
              editorFactory.copyTemplate(product);
            } else {
              templateEditorFactory.createFromTemplate(product);
            }
          };

        } //link()
      };
    }
  ]);
