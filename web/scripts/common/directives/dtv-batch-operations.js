'use strict';

angular.module('risevision.apps.directives')
  .directive('batchOperations', ['$modal',
    function ($modal) {
      return {
        restrict: 'E',
        scope: {
          listObject: '=',
          listOperations: '=',
        },
        templateUrl: 'partials/common/batch-operations.html',
        link: function ($scope) {
          if ($scope.listOperations && $scope.listOperations.operations && $scope.listObject) {
            var deleteOperation = _.find($scope.listOperations.operations, {
              name: 'Delete'
            });

            if (deleteOperation) {
              var deleteAction = $scope.listObject.getSelectedAction(deleteOperation.actionCall, true);

              deleteOperation.actionCall = function() {
                $modal.open({
                  templateUrl: 'partials/common/bulk-delete-confirmation-modal.html',
                  controller: 'BulkDeleteModalCtrl',
                  windowClass: 'madero-style centered-modal',
                  size: 'sm',
                  resolve: {
                    selectedItems: $scope.listObject.getSelected,
                    itemName: function() {
                      return $scope.listOperations.name;
                    }
                  }
                }).result.then(deleteAction);
              };
            }
          }
        } //link()
      };
    }
  ]);
