'use strict';

angular.module('risevision.apps.directives')
  .directive('batchOperations', ['$modal', 'userState',
    function ($modal, userState) {
      return {
        restrict: 'E',
        scope: {
          listObject: '=',
          listOperations: '=',
        },
        templateUrl: 'partials/common/batch-operations.html',
        link: function ($scope) {
          var _filterByRole = function() {
            _.remove($scope.listOperations.operations, function(operation) {
              if (!operation.requireRole) {
                return false;
              }

              return !userState.hasRole(operation.requireRole);
            });            
          };

          var _updateDelete = function() {
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
          };

          if ($scope.listOperations && $scope.listOperations.operations && $scope.listObject) {
            _filterByRole();
            _updateDelete();
          }
        } //link()
      };
    }
  ]);
