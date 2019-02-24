'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorToolbar', ['templateEditorFactory', '$templateCache', '$modal',
    function (templateEditorFactory, $templateCache, $modal) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/toolbar.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          $scope.confirmDelete = function () {
            $scope.modalInstance = $modal.open({
              template: $templateCache.get('partials/template-editor/confirm-delete-modal.html'),
              controller: 'confirmInstance',
              windowClass: 'modal-custom',
              resolve: {
                confirmationTitle: function () {
                  return 'editor-app.details.deleteTitle';
                },
                confirmationMessage: function () {
                  return 'editor-app.details.deleteWarning';
                },
                confirmationButton: function () {
                  return 'common.delete-forever';
                },
                cancelButton: null
              }
            });

            $scope.modalInstance.result.then(function () {
              $scope.modalInstance.dismiss();
              templateEditorFactory.deletePresentation();
            });
          };
        }
      };
    }
  ]);
