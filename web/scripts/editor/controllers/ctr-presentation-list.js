'use strict';
angular.module('risevision.editor.controllers')
  .controller('PresentationListController', ['$scope',
    'ScrollingListService', 'presentation', 'editorFactory', '$loading',
    '$filter', 'presentationTracker', '$state', 'HTML_TEMPLATE_TYPE',
    function ($scope, ScrollingListService, presentation, editorFactory,
      $loading, $filter, presentationTracker, $state, HTML_TEMPLATE_TYPE) {
      $scope.search = {
        sortBy: 'changeDate',
        reverse: true,
        count: $scope.listLimit,
        name: 'Presentations'
      };

      editorFactory.presentations = new ScrollingListService(presentation.list,
        $scope.search);
      $scope.factory = editorFactory.presentations;
      $scope.editorFactory = editorFactory;
      $scope.presentationTracker = presentationTracker;

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'editor-app.list.filter.placeholder'),
        id: 'presentationSearchInput'
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('presentation-list-loader');
        } else {
          $loading.stop('presentation-list-loader');
        }
      });

      $scope.openPresentation = function(presentation) {
        if (presentation.presentationType !== HTML_TEMPLATE_TYPE) {
          $state.go('apps.editor.workspace.artboard', { presentationId: presentation.id });
        } else {
          $state.go('apps.editor.templates.edit', { presentationId: presentation.id });
        }
      };
    }
  ]);
