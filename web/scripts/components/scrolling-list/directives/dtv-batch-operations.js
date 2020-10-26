'use strict';

angular.module('risevision.common.components.scrolling-list')
  .directive('batchOperations', ['$window', '$modal', '$state', 'userState',
    function ($window, $modal, $state, userState) {
      return {
        restrict: 'E',
        scope: {
          listObject: '='
        },
        templateUrl: 'partials/common/batch-operations.html',
        link: function ($scope) {
          var _filterByRole = function () {
            _.remove($scope.listObject.batchOperations.operations, function (operation) {
              if (!operation.requireRole) {
                return false;
              }

              return !userState.hasRole(operation.requireRole);
            });
          };

          var _updateDeleteAction = function () {
            _.each($scope.listObject.batchOperations.operations, function (operation) {
              if (operation.isDelete) {
                operation.beforeBatchAction = function () {
                  return $modal.open({
                    templateUrl: 'partials/common/bulk-delete-confirmation-modal.html',
                    controller: 'BulkDeleteModalCtrl',
                    windowClass: 'madero-style centered-modal',
                    size: 'sm',
                    resolve: {
                      selectedItems: $scope.listObject.getSelected,
                      itemName: function () {
                        return $scope.listObject.batchOperations.name;
                      }
                    }
                  }).result;
                };
              }
            });

          };

          if ($scope.listObject.batchOperations && $scope.listObject.batchOperations.operations && $scope
            .listObject) {
            _filterByRole();
            _updateDeleteAction();
          }

          var _bypass = false;
          $scope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (_bypass) {
              _bypass = false;
              return;
            }
            if ($scope.listObject.batchOperations.activeOperation) {
              var operationName = $scope.listObject.batchOperations.activeOperation.name.toLowerCase();

              event.preventDefault();
              var modalInstance = $modal.open({
                templateUrl: 'partials/components/confirm-modal/madero-confirm-modal.html',
                controller: 'confirmModalController',
                windowClass: 'madero-style centered-modal',
                size: 'sm',
                resolve: {
                  confirmationTitle: function () {
                    return 'Cancel bulk ' + operationName + '?';
                  },
                  confirmationMessage: function () {
                    return 'A bulk ' + operationName +
                      ' is in progress. Navigating away from this page will cancel this action. Are you sure you want to cancel?';
                  },
                  confirmationButton: function () {
                    return 'Yes, Cancel';
                  },
                  cancelButton: function () {
                    return 'No';
                  }
                }
              });
              modalInstance.result.then(function () {
                $scope.listObject.batchOperations.cancel();

                _bypass = true;
                $state.go(toState, toParams);
              });
            }
          });

          $window.onbeforeunload = function () {
            if ($scope.listObject.batchOperations.activeOperation) {
              return 'Cancel bulk action?';
            }
          };

          $scope.$on('$destroy', function () {
            $window.onbeforeunload = undefined;
          });

        } //link()
      };
    }
  ]);
