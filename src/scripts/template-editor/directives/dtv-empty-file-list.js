'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorEmptyFileList', [
    function () {
      return {
        restrict: 'E',
        scope: {
          fileType: '@',
          isEditingLogo: '='
        },
        templateUrl: 'partials/template-editor/empty-file-list.html',
        link: function () {}
      };
    }
  ]);
