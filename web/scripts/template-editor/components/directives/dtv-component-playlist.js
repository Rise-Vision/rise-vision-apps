'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentPlaylist', ['templateEditorFactory', 'presentation', '$log',
    function (templateEditorFactory, presentation, $log) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-playlist.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.searchKeyword = '';
          $scope.templatesSearch = [];

          function _load() {
            //
          }

          $scope.save = function () {
            //
          };

          $scope.registerDirective({
            type: 'rise-playlist',
            iconType: 'streamline',
            icon: 'embedded-template',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
            }
          });

          $scope.showAddTemplates = function () {
            $scope.view = 'add-templates';
            $scope.searchTemplates();
          };

          $scope.showSelectedTemplates = function () {
            $scope.view = '';
          };

          $scope.searchTemplates = function () {

            $scope.searching = true;
            $scope.canAddTemplate = false;

            var search = {
              query: $scope.searchKeyword,
              filter: 'presentationType:"HTML Template"'
            };

            presentation.list(search)
            .then(function (result) {
              $scope.templatesSearch = angular.copy(result.items);

              $scope.searching = false;
            })
            .catch(function (err) {
              $log.error(err);
              $scope.searching = false;
            });
          };

        }
      };
    }
  ]);