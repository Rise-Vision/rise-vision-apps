'use strict';
angular.module('risevision.editor.controllers')
  .value('PRESENTATION_SEARCH', {
    filter: ''
  })
  .controller('PresentationListController', ['$scope',
    'ScrollingListService', 'presentation', 'editorFactory', 'templateEditorFactory', '$loading',
    '$filter', 'presentationUtils', 'PRESENTATION_SEARCH',
    function ($scope, ScrollingListService, presentation, editorFactory, templateEditorFactory,
      $loading, $filter, presentationUtils, PRESENTATION_SEARCH) {
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
          actionCall: function(presentation) {
            return editorFactory.deletePresentationByObject(presentation)
              .catch(function(e) {
                if (e.status === 409) {
                  $scope.presentations.errorMessage = 'Some presentations could not be deleted.';
                  $scope.presentations.apiError = 'These presentations are used in one or more schedules. To delete them, please remove them from the schedules they are being used in, and try again.'; 
                }

                throw e;
              });
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
