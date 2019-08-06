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
          var STREAMLINE_URI = /^streamline:(.+)/;

          $scope.factory = templateEditorFactory;
          $scope.fileName = templateEditorUtils.fileNameOf($scope.entry.file);

          var thumbnailUrl = $scope.entry && $scope.entry['thumbnail-url'];

          $scope.isStreamlineThumbnail = !!(thumbnailUrl && STREAMLINE_URI.test(thumbnailUrl));
          $scope.streamlineIcon = $scope.isStreamlineThumbnail ?
            thumbnailUrl.match(STREAMLINE_URI)[1] : '';

          $scope.getFileName = function () {
            return templateEditorUtils.fileNameOf($scope.entry.file);
          };

          $scope.removeFileFromList = function () {
            $scope.removeAction($scope.entry);
          };
        }
      };
    }
  ]);
