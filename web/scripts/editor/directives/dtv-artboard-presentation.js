'use strict';

angular.module('risevision.editor.directives')
  .directive('artboardPresentation', ['editorFactory', 'artboardFactory',
    'placeholderFactory', 'PRESENTATION_BORDER_SIZE', '$stateParams',
    function (editorFactory, artboardFactory, placeholderFactory,
      PRESENTATION_BORDER_SIZE, $stateParams) {
      return {
        scope: true,
        restrict: 'E',
        templateUrl: 'partials/editor/artboard-presentation.html',
        link: function ($scope, element, attrs) {
          var heightIncrement = 2 * PRESENTATION_BORDER_SIZE;
          var widthIncrement = 2 * PRESENTATION_BORDER_SIZE;

          $scope.editorFactory = editorFactory;
          $scope.placeholderFactory = placeholderFactory;
          element.addClass('artboard-presentation');
          artboardFactory.zoomFit();

          $scope.$watch('editorFactory.presentation', function () {
            $scope.presentation = editorFactory.presentation;
            element.css('width', ($scope.presentation.width +
                widthIncrement) + $scope.presentation
              .widthUnits);
            element.css('height', ($scope.presentation.height +
                heightIncrement) + $scope.presentation
              .heightUnits);
            element.css('background', $scope.presentation.backgroundStyle);
            element.css('backgroundSize',
              $scope.presentation.backgroundScaleToFit ? 'contain' :
              '');
            element.css('transition', 'all 0s');
          }, true);

          $scope.$watch(function () {
            return artboardFactory.zoomLevel;
          }, function () {
            element.css('transform', 'scale(' + artboardFactory.zoomLevel + ')');
            element.css('transform-origin', '0% 0%');
            element.css('transition', 'all .4s');
          });

          element.on('mousewheel DOMMouseScroll', function (e) {
            if (e.ctrlKey) {
              e.preventDefault();
              $scope.$apply(function () {
                if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {
                  artboardFactory.zoomOut();
                } else {
                  artboardFactory.zoomIn();
                }
              });
            }
          });

          $scope.showEmptyState = function () {
            return !editorFactory.presentation.id && !$scope.hasUnsavedChanges &&
              !$stateParams.copyOf;
          };
        } //link()
      };
    }
  ]);
