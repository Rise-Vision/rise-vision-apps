'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorFileEntry', ['templateEditorFactory', 'templateEditorUtils',
    function (templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          fileType: '@',
          entry: '=',
          removeAction: '=',
          showGripHandle: '=',
        },
        templateUrl: 'partials/template-editor/file-entry.html',
        link: function ($scope) {
          var STREAMLINE_URI = /^streamline:(.+)/;

          $scope.factory = templateEditorFactory;

          $scope.getFileName = function () {
            return templateEditorUtils.fileNameOf($scope.entry.file);
          };

          function getThumbnailUrl() {
            return $scope.entry && $scope.entry['thumbnail-url'];
          }

          $scope.isStreamlineThumbnail = function () {
            var thumbnailUrl = getThumbnailUrl();

            return !!(thumbnailUrl && STREAMLINE_URI.test(thumbnailUrl));
          };

          $scope.getStreamlineIcon = function () {
            return $scope.isStreamlineThumbnail() ?
              getThumbnailUrl().match(STREAMLINE_URI)[1] : '';
          };

          $scope.removeFileFromList = function () {
            $scope.removeAction($scope.entry);
          };
        }
      };
    }
  ]);
