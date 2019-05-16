'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('weeklyTemplates', ['productsFactory', 'ScrollingListService', 'presentationUtils',
    'editorFactory', 'templateEditorFactory', 'userState', '$sessionStorage',
    function (productsFactory, ScrollingListService, presentationUtils, editorFactory,
      templateEditorFactory, userState, $sessionStorage) {
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
            query: 'templateOfTheWeek:1',
            category: 'Templates',
            count: 4
          };

          var company = userState.getCopyOfSelectedCompany();

          if (company.companyIndustry === 'PRIMARY_SECONDARY_EDUCATION' ||
            company.companyIndustry === 'HIGHER_EDUCATION') {

            $scope.factory = new ScrollingListService(productsFactory.loadProducts,
              $scope.search);
          }

          $scope.toggleView = function () {
            $scope.fullView = !$scope.fullView;
            $sessionStorage.weeklyTemplatesFullView = $scope.fullView;
          };

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
