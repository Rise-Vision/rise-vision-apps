'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholdersList', ['$modal', '$templateCache',
    'placeholdersFactory', 'placeholderFactory', 'editorFactory',
    function ($modal, $templateCache, placeholdersFactory, placeholderFactory,
      editorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/editor/placeholders-list.html',
        link: function ($scope) {
          $scope.factory = placeholdersFactory;
          $scope.editorFactory = editorFactory;

          $scope.manage = function (placeholder) {
            placeholderFactory.setPlaceholder(placeholder);
          };

          $scope.remove = function (placeholder) {
            var modalInstance = $modal.open({
              template: $templateCache.get(
                'partials/components/confirm-modal/confirm-modal.html'),
              controller: 'confirmModalController',
              windowClass: 'modal-custom',
              resolve: {
                confirmationTitle: function () {
                  return 'editor-app.details.removePlaceholder';
                },
                confirmationMessage: function () {
                  return '' +
                    'editor-app.details.removePlaceholderWarning';
                },
                confirmationButton: function () {
                  return 'editor-app.details.remove';
                },
                cancelButton: null
              }
            });

            modalInstance.result.then(function () {
              placeholdersFactory.removePlaceholder(placeholder);
            });
          };
        } //link()
      };
    }
  ]);
