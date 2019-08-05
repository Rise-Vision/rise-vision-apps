'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorFileEntry', ['templateEditorFactory', 'templateEditorUtils',
    function (templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: {
          fileType: '@',
          entry: '=',
          removeAction: '=',
          thumbnailType: '@'
        },
        templateUrl: 'partials/template-editor/file-entry.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
          $scope.fileName = templateEditorUtils.fileNameOf($scope.entry.file);

          $scope.isStreamlineThumbnail = function() {
            var thumbnailUrl = $scope.entry && $scope.entry['thumbnail-url'];

            return thumbnailUrl && /^streamline:.+/.test( thumbnailUrl );
          };

          $scope.streamlineIcon = $scope.isStreamlineThumbnail() ?
            $scope.entry['thumbnail-url'].substring(11) : '';

          $scope.removeFileFromList = function () {
            $scope.removeAction($scope.entry);
          };
        }
      };
    }
  ]);
