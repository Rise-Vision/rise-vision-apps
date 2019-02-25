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
              template: $templateCache.get('partials/template-editor/confirm-modal.html'),
              controller: 'confirmInstance',
              windowClass: 'modal-custom',
              resolve: {
                confirmationMessage: function () {
                  return 'template.confirm-modal.delete-warning';
                },
                confirmationButton: function () {
                  return 'common.delete-forever';
                },
                confirmationTitle: null,
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
