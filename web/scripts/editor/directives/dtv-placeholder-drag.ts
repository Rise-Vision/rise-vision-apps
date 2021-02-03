'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderDrag', ['$document', 'artboardFactory',
    function ($document, artboardFactory) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var startX = 0;
          var startY = 0;

          element.on('mousedown', function ($event) {
            $event.preventDefault();
            startX = $event.pageX - $scope.placeholder.left * artboardFactory.zoomLevel;
            startY = $event.pageY - $scope.placeholder.top * artboardFactory.zoomLevel;
            $document.on('mousemove', mouseMove);
            $document.on('mouseup', mouseUp);
          });

          var mouseMove = function ($event) {
            $scope.$apply(function () {
              $scope.placeholder.top = ($event.pageY - startY) / artboardFactory.zoomLevel;
              $scope.placeholder.left = ($event.pageX - startX) / artboardFactory.zoomLevel;
            });
          };

          var mouseUp = function () {
            $document.off('mousemove', mouseMove);
            $document.off('mouseup', mouseUp);
          };
        } //link()
      };
    }
  ]);
