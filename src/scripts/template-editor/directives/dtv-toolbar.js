'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorToolbar', ['templateEditorFactory', 'ngModalService',
    function (templateEditorFactory, ngModalService) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/toolbar.html',
        link: function ($scope) {
          $scope.templateEditorFactory = templateEditorFactory;

          $scope.confirmDelete = function () {
            ngModalService.confirmDanger('Are you sure you want to delete this Presentation?',
              null,
              'Delete Forever'
            ).then(function () {
              templateEditorFactory.deletePresentation();
            });
          };

        }
      };
    }
  ]);
