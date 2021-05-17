'use strict';

angular.module('risevision.template-editor.directives')
  .directive('componentPresentationSelector', ['$loading', 'componentsFactory', 'playlistComponentFactory',
    'editorFactory',
    function ($loading, componentsFactory, playlistComponentFactory, editorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-presentation-selector.html',
        link: function ($scope, element) {
          $scope.playlistComponentFactory = playlistComponentFactory;
          $scope.filterConfig = {
            placeholder: 'Search Presentations',
            id: 'te-playlist-search'
          };

          componentsFactory.registerDirective({
            type: 'rise-presentation-selector',
            element: element,
            show: function () {
              playlistComponentFactory.load();
            }
          });

          $scope.addTemplates = function() {
            playlistComponentFactory.addTemplates();

            componentsFactory.showPreviousPage();
          };

          $scope.createNewTemplate = function () {
            editorFactory.addPresentationModal();
          };

          $scope.$watch('playlistComponentFactory.templates.loadingItems', function (loading) {
            if (loading) {
              $loading.start('presentation-selector-loader');
            } else {
              $loading.stop('presentation-selector-loader');
            }
          });
        }
      };
    }
  ]);
