'use strict';

angular.module('risevision.common.components.distribution-selector')
  .directive('distributionSelector', ['$modal',
    function ($modal) {
      return {
        restrict: 'E',
        scope: {
          distribution: '=',
          distributeToAll: '=',
          distributionStyle: '@',
          hideCta: '='
        },
        templateUrl: 'partials/components/distribution-selector/distribution-selector.html',
        link: function ($scope) {
          var _getDistributionSelectionMessage = function () {
            var message = 'No Displays Selected';

            if ($scope.distribution && $scope.distribution.length > 0) {
              if ($scope.distribution.length === 1) {
                message = '1 Display Selected';
              } else {
                message = $scope.distribution.length + ' Displays Selected';
              }
            }
            return message;
          };

          var _refreshDistributionSelectionMessage = function () {
            $scope.distributionSelectionMessage =
              _getDistributionSelectionMessage();
          };

          $scope.$watchGroup(['distribution', 'distributeToAll'], function () {
            if (typeof $scope.distributeToAll === 'undefined') {
              $scope.distributeToAll = true;
            }

            if (!$scope.distributeToAll) {
              _refreshDistributionSelectionMessage();
            }
          });

          $scope.manage = function () {

            var modalInstance = $modal.open({
              templateUrl: 'partials/components/distribution-selector/distribution-modal.html',
              controller: 'selectDistributionModal',
              size: 'lg',
              resolve: {
                distribution: function () {
                  return $scope.distribution;
                }
              }
            });

            modalInstance.result.then(function (distribution) {
              $scope.distribution = distribution;
            });
          };
        } //link()
      };
    }
  ]);
