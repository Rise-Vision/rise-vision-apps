'use strict';
angular.module('risevision.editor.controllers')
  .controller('PresentationListController', ['$scope',
    'ScrollingListService', 'presentation', 'editorFactory', 'templateEditorFactory', '$loading',
    '$filter', 'presentationTracker', '$state', 'HTML_PRESENTATION_TYPE',
    function ($scope, ScrollingListService, presentation, editorFactory, templateEditorFactory,
      $loading, $filter, presentationTracker, $state, HTML_PRESENTATION_TYPE) {
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
      $scope.templateEditorFactory = templateEditorFactory;
      $scope.presentationTracker = presentationTracker;

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'editor-app.list.filter.placeholder'),
        id: 'presentationSearchInput'
      };

      $scope.$watchGroup([
        'factory.loadingItems',
        'editorFactory.loadingPresentation',
        'templateEditorFactory.loadingPresentation'], function (newValues) {
        if (!newValues[0] && !newValues[1] && !newValues[2]) {
          $loading.stop('presentation-list-loader');
        } else {
          $loading.start('presentation-list-loader');
        }
      });

      $scope.openPresentation = function(presentation) {
        if (presentation.presentationType !== HTML_PRESENTATION_TYPE) {
          $state.go('apps.editor.workspace.artboard', { presentationId: presentation.id });
        } else {
          $state.go('apps.editor.templates.edit', { presentationId: presentation.id });
        }
      };
    }
  ]);
