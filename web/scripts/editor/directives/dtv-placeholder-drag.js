'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderDrag', ['$document',
    function ($document) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var startX = 0;
            var startY = 0;

            element.on('mousedown', function ($event) {
              $event.preventDefault();
              startX = $event.pageX - $scope.placeholder.left;
              startY = $event.pageY - $scope.placeholder.top;
              $document.on('mousemove', mouseMove);
              $document.on('mouseup', mouseUp);
            });

            var mouseMove = function ($event) {
              $scope.$apply(function () {
                $scope.placeholder.top = $event.pageY - startY;
                $scope.placeholder.left = $event.pageX - startX;
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
