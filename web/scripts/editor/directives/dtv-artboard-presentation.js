'use strict';

angular.module('risevision.editor.directives')
  .constant('PRESENTATION_TOOLBAR_SIZE', 60)
  .constant('PRESENTATION_BORDER_SIZE', 12)
  .directive('artboardPresentation', ['editorFactory', 'placeholderFactory',
    'PRESENTATION_TOOLBAR_SIZE', 'PRESENTATION_BORDER_SIZE', '$stateParams',
    function (editorFactory, placeholderFactory, PRESENTATION_TOOLBAR_SIZE,
      PRESENTATION_BORDER_SIZE, $stateParams) {
      return {
        scope: true,
        restrict: 'E',
        templateUrl: 'partials/editor/artboard-presentation.html',
        link: function ($scope, element, attrs) {
            var heightIncrement = PRESENTATION_TOOLBAR_SIZE +
              PRESENTATION_BORDER_SIZE;
            var widthIncrement = 2 * PRESENTATION_BORDER_SIZE;

            $scope.editorFactory = editorFactory;
            $scope.placeholderFactory = placeholderFactory;
            element.addClass('artboard-presentation');

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
            }, true);

            $scope.showEmptyState = function () {
              return !editorFactory.presentation.id && !$scope.hasUnsavedChanges &&
                !$stateParams.copyPresentation;
            };
          } //link()
      };
    }
  ]);
