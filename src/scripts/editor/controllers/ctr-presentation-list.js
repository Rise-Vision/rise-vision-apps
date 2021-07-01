'use strict';
angular.module('risevision.editor.controllers')
  .value('PRESENTATION_SEARCH', {
    filter: ''
  })
  .controller('PresentationListController', ['$scope',
    'ScrollingListService', 'presentation', 'editorFactory', 'templateEditorFactory', '$loading',
    '$filter', 'presentationUtils', 'PRESENTATION_SEARCH', 'ngModalService',
    function ($scope, ScrollingListService, presentation, editorFactory, templateEditorFactory,
      $loading, $filter, presentationUtils, PRESENTATION_SEARCH, ngModalService) {

      ngModalService.confirm('title', 'message')
      .then(function() {
        console.log('confirmed');
      }).catch(function() {
        console.log('cancelled');
      });

      $scope.search = {
        sortBy: 'changeDate',
        reverse: true,
        count: $scope.listLimit,
        name: 'Presentations',
        filter: PRESENTATION_SEARCH.filter
      };

      $scope.listOperations = {
        name: 'Presentation',
        operations: [{
          name: 'Delete',
          actionCall: function (presentation) {
            return editorFactory.deletePresentationByObject(presentation, true);
          },
          showActionError: function (err) {
            if (err && err.status === 409) {
              return true;
            }
            return false;
          },
          requireRole: 'cp'
        }]
      };
      $scope.presentations = new ScrollingListService(presentation.list, $scope.search, $scope.listOperations);

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
