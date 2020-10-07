'use strict';
angular.module('risevision.editor.controllers')
  .value('PRESENTATION_SEARCH', {
    filter: ''
  })
  .controller('PresentationListController', ['$q', '$scope',
    'ScrollingListService', 'presentation', 'editorFactory', 'templateEditorFactory', '$loading',
    '$filter', 'presentationUtils', 'PRESENTATION_SEARCH',
    function ($q, $scope, ScrollingListService, presentation, editorFactory, templateEditorFactory,
      $loading, $filter, presentationUtils, PRESENTATION_SEARCH) {
      $scope.search = {
        sortBy: 'changeDate',
        reverse: true,
        count: $scope.listLimit,
        name: 'Presentations',
        filter: PRESENTATION_SEARCH.filter
      };

      $scope.presentations = new ScrollingListService(presentation.list, $scope.search);
      $scope.listOperations = {
        name: 'Presentation',
        operations: [{
          name: 'Delete',
          actionCall: editorFactory.deletePresentationByObject,
          requireRole: 'cp'
        }]
      };

      $scope.editorFactory = editorFactory;
      $scope.templateEditorFactory = templateEditorFactory;
      $scope.isHtmlPresentation = presentationUtils.isHtmlPresentation;

      $scope.filterConfig = {
        placeholder: $filter('translate')('editor-app.list.filter.placeholder'),
        id: 'presentationSearchInput'
      };

      $scope.$watchGroup([
        'presentations.loadingItems',
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
