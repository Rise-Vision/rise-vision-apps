'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorFileEntry', ['templateEditorFactory', 'templateEditorUtils',
    function (templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: {
          fileType: '@',
          entry: '=',
          removeAction: '='
        },
        templateUrl: 'partials/template-editor/file-entry.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
          $scope.fileName = templateEditorUtils.fileNameOf($scope.entry.file);

          $scope.removeFileFromList = function () {
            $scope.removeAction($scope.entry);
          };
        }
      };
    }
  ]);
