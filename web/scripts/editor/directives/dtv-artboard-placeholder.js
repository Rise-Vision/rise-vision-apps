'use strict';

angular.module('risevision.editor.directives')
  .directive('artboardPlaceholder', ['placeholderFactory', 'widgetRenderer',
    function (placeholderFactory, widgetRenderer) {
      return {
        scope: {
          placeholder: '='
        },
        restrict: 'E',
        link: function ($scope, element, attrs) {
          $scope.factory = placeholderFactory;
          element.addClass('ph-block');

          $scope.$watch('placeholder', function (newValue, oldValue) {
            element.css('top', $scope.placeholder.top + $scope.placeholder
              .topUnits);
            element.css('left', $scope.placeholder.left + $scope.placeholder
              .leftUnits);
            element.css('width', $scope.placeholder.width + $scope.placeholder
              .widthUnits);
            element.css('height', $scope.placeholder.height + $scope.placeholder
              .heightUnits);
            element.css('background', $scope.placeholder.backgroundStyle);
            element.css('backgroundSize',
              $scope.placeholder.backgroundScaleToFit ? 'contain' :
              '');
            element.css('z-index', $scope.placeholder.zIndex);

            if (newValue.id !== oldValue.id) {
              widgetRenderer.unregister(oldValue, element);
            }

            widgetRenderer.notifyChanges($scope.placeholder, element);
            if (newValue.items && newValue.items[0] && oldValue.items &&
              oldValue.items[0] && newValue.items[0].additionalParams !==
              oldValue.items[0].additionalParams) {
              widgetRenderer.forceReload($scope.placeholder, element);
            }
          }, true);

          $scope.$watch('factory.placeholder', function () {
            if (placeholderFactory.placeholder === $scope.placeholder) {
              element.css('z-index', 100);
              element.addClass('edit-mode');
            } else {
              element.css('z-index', $scope.placeholder.zIndex);
              element.removeClass('edit-mode');
            }
          }, true);

          widgetRenderer.register($scope.placeholder, element);

          $scope.$on('$destroy', function () {
            widgetRenderer.unregister($scope.placeholder, element);
          });

        } //link()
      };
    }
  ]);
