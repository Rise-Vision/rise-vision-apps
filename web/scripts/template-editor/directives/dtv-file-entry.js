'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorFileEntry', ['templateEditorFactory',
    function (templateEditorFactory) {
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

          $scope.removeFileFromList = function() {
            $scope.removeAction($scope.entry);
          }
        }
      };
    }
  ]);
