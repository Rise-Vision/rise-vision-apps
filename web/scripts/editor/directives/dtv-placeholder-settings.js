'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderSettings', ['placeholderFactory',
    'presentationParser', 'editorFactory', 'backgroundParser', 'userState',
    function (placeholderFactory, presentationParser, editorFactory,
      backgroundParser, userState) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/editor/placeholder-settings.html',
        link: function ($scope) {
          $scope.companyId = userState.getSelectedCompanyId();
          $scope.factory = placeholderFactory;

          $scope.$watch('factory.placeholder', function (newPlaceholder) {
            $scope.placeholder = newPlaceholder;
            $scope.editingName = false;
            $scope.background = undefined;

            if (newPlaceholder) {
              $scope.background = backgroundParser.parseBackground(
                newPlaceholder.backgroundStyle,
                newPlaceholder.backgroundScaleToFit
              );
            }
          });

          $scope.$watch('background', function () {
            if ($scope.placeholder) {
              $scope.placeholder.backgroundStyle = backgroundParser.getStyle(
                $scope.background);
              $scope.placeholder.backgroundScaleToFit =
                backgroundParser.getScaleToFit($scope.background);
            }
          }, true);

          $scope.updatePlaceholderName = function () {
            if (!$scope.editingName ||
              $scope.placeholderFields.newId.$invalid ||
              $scope.placeholder.id === $scope.placeholder.newId) {
              return;
            }

            presentationParser.updatePresentation(editorFactory.presentation);

            $scope.editingName = false;
          };
        }
      };
    }
  ]);
