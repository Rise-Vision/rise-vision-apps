'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorEmptyFileList', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: {
          fileType: '@'
        },
        templateUrl: 'partials/template-editor/empty-file-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
        }
      };
    }
  ]);
