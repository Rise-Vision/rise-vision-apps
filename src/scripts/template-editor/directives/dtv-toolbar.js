'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorToolbar', ['templateEditorFactory', '$templateCache', '$modal',
    function (templateEditorFactory, $templateCache, $modal) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/toolbar.html',
        link: function ($scope, element) {
          $scope.templateEditorFactory = templateEditorFactory;

          $scope.confirmDelete = function () {
            $scope.modalInstance = $modal.open({
              template: $templateCache.get(
                'partials/components/confirm-modal/madero-confirm-danger-modal.html'),
              controller: 'confirmModalController',
              windowClass: 'madero-style centered-modal',
              resolve: {
                confirmationTitle: function () {
                  return 'template.confirm-modal.delete-warning';
                },
                confirmationButton: function () {
                  return 'common.delete-forever';
                },
                confirmationMessage: null,
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
