'use strict';

angular.module('risevision.template-editor.directives')
  .constant('FILTER_HTML_TEMPLATES', 'presentationType:"HTML Template"')
  .directive('templateComponentPlaylist', ['templateEditorFactory', 'presentation', '$log', 'FILTER_HTML_TEMPLATES',
    function (templateEditorFactory, presentation, $log, FILTER_HTML_TEMPLATES) {
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
              filter: presentation.buildFilterString($scope.searchKeyword, FILTER_HTML_TEMPLATES)
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

          $scope.searchKeyPressed = function (keyEvent) {
            // handle enter key
            if (keyEvent.which === 13) {
              $scope.searchTemplates();
            }
          };

          $scope.resetSearch = function () {
            $scope.searchKeyword = '';
            $scope.templatesSearch = [];
            $scope.searchTemplates();
          };

        }
      };
    }
  ]);