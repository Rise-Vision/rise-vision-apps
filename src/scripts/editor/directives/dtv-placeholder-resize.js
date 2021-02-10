'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderResize', ['$document', 'widgetRenderer', 'artboardFactory',
    function ($document, widgetRenderer, artboardFactory) {
      return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {
          var $mouseDown;

          var resizeUp = function ($event) {
            var lowest = $mouseDown.top + $mouseDown.height;
            var top = $mouseDown.top + ($event.pageY - $mouseDown.pageY) / artboardFactory.zoomLevel;
            top = top > lowest ? lowest : top;
            var height = $mouseDown.top - top + $mouseDown.height;
            $scope.$apply(function () {
              $scope.placeholder.top = top;
              $scope.placeholder.height = height;
            });
          };

          var resizeRight = function ($event) {
            var width = $mouseDown.width + ($event.pageX - $mouseDown.pageX) / artboardFactory.zoomLevel;
            width = width > 0 ? width : 0;
            $scope.$apply(function () {
              $scope.placeholder.width = width;
            });
          };

          var resizeDown = function ($event) {
            var height = $mouseDown.height + ($event.pageY - $mouseDown.pageY) / artboardFactory.zoomLevel;
            height = height > 0 ? height : 0;
            $scope.$apply(function () {
              $scope.placeholder.height = height;
            });
          };

          var resizeLeft = function ($event) {
            var rightest = $mouseDown.left + $mouseDown.width;
            var left = $mouseDown.left + ($event.pageX - $mouseDown.pageX) / artboardFactory.zoomLevel;
            left = left > rightest ? rightest : left;
            var width = $mouseDown.left - left + $mouseDown.width;
            $scope.$apply(function () {
              $scope.placeholder.left = left;
              $scope.placeholder.width = width;
            });
          };

          var createResizer = function (className, handlers) {
            var newElement = angular.element('<div class="' + className +
              ' resize"></div>');
            $element.append(newElement);
            newElement.on('mousedown', function ($event) {
              $event.preventDefault();
              $event.stopPropagation();

              var mousemove = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                for (var i = 0; i < handlers.length; i++) {
                  handlers[i]($event);
                }
              };

              var mouseup = function () {
                $event.preventDefault();
                $event.stopPropagation();
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
                widgetRenderer.forceReload($scope.placeholder,
                  $element);
              };

              $document.on('mousemove', mousemove);
              $document.on('mouseup', mouseup);

              $mouseDown = $event;
              $mouseDown.top = $element[0].offsetTop;
              $mouseDown.left = $element[0].offsetLeft;
              $mouseDown.width = $element[0].offsetWidth;
              $mouseDown.height = $element[0].offsetHeight;
            });
          };

          createResizer('sw-resize', [resizeDown, resizeLeft]);
          createResizer('ne-resize', [resizeUp, resizeRight]);
          createResizer('nw-resize', [resizeUp, resizeLeft]);
          createResizer('se-resize', [resizeDown, resizeRight]);
          createResizer('w-resize', [resizeLeft]);
          createResizer('e-resize', [resizeRight]);
          createResizer('n-resize', [resizeUp]);
          createResizer('s-resize', [resizeDown]);
        } //link()
      };
    }
  ]);
