'use strict';
angular.module('risevision.editor.controllers')
  .value('PRESENTATION_SEARCH', {
    filter: ''
  })
  .controller('PresentationListController', ['$scope',
    'ScrollingListService', 'presentation', 'editorFactory', 'templateEditorFactory', '$loading',
    '$filter', 'presentationTracker', 'presentationUtils', 'PRESENTATION_SEARCH',
    function ($scope, ScrollingListService, presentation, editorFactory, templateEditorFactory,
      $loading, $filter, presentationTracker, presentationUtils, PRESENTATION_SEARCH) {
      $scope.search = {
        sortBy: 'changeDate',
        reverse: true,
        count: $scope.listLimit,
        name: 'Presentations',
        filter: PRESENTATION_SEARCH.filter
      };

      editorFactory.presentations = new ScrollingListService(presentation.list,
        $scope.search);
      $scope.factory = editorFactory.presentations;
      $scope.editorFactory = editorFactory;
      $scope.templateEditorFactory = templateEditorFactory;
      $scope.presentationTracker = presentationTracker;
      $scope.openPresentation = presentationUtils.openPresentation;

      $scope.filterConfig = {
        placeholder: $filter('translate')('editor-app.list.filter.placeholder'),
        id: 'presentationSearchInput'
      };

      $scope.$watchGroup([
        'factory.loadingItems',
        'editorFactory.loadingPresentation',
        'templateEditorFactory.loadingPresentation'
      ], function (newValues) {
        if (!newValues[0] && !newValues[1] && !newValues[2]) {
          $loading.stop('presentation-list-loader');
        } else {
          $loading.start('presentation-list-loader');
        }
      });
    }
  ]);
