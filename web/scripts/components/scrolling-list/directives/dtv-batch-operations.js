'use strict';

angular.module('risevision.common.components.scrolling-list')
  .directive('batchOperations', ['$window', '$modal', '$state', 'userState',
    function ($window, $modal, $state, userState) {
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

          var _updateListActions = function() {
            _.each($scope.listOperations.operations, function(operation) {

              if (operation.name === 'Delete') {
                var deleteAction = $scope.listObject.getSelectedAction(operation.actionCall, operation.name, true);

                operation.actionCall = function() {
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
              } else {
                operation.actionCall = $scope.listObject.getSelectedAction(operation.actionCall, operation.name);
              }
            });

          };

          if ($scope.listOperations && $scope.listOperations.operations && $scope.listObject) {
            _filterByRole();
            _updateListActions();
          }

          var _bypass = false;
          $scope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (_bypass) {
              _bypass = false;
              return;
            }
            if ($scope.listObject.operations.activeOperation) {
              event.preventDefault();
              var modalInstance = $modal.open({
                templateUrl: 'partials/components/confirm-modal/madero-confirm-modal.html',
                controller: 'confirmModalController',
                windowClass: 'madero-style centered-modal',
                size: 'sm',
                resolve: {
                  confirmationTitle: function () {
                    return 'Cancel bulk ' + $scope.listObject.operations.activeOperation.toLowerCase() + '?';
                  },
                  confirmationMessage: function () {
                    return 'A bulk ' + $scope.listObject.operations.activeOperation.toLowerCase() +
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
                $scope.listObject.operations.cancel();

                _bypass = true;
                $state.go(toState, toParams);
              });
            }
          });

          $window.onbeforeunload = function () {
            if ($scope.listObject.operations.activeOperation) {
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
