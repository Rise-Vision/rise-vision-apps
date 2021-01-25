'use strict';

angular.module('risevision.apps.billing.directives')
  .directive('editPoNumber', ['$templateCache',
    function ($templateCache) {
      return {
        restrict: 'E',
        scope: {
          item: '=',
          updateFunction: '&'
        },
        template: $templateCache.get('partials/billing/edit-po-number.html'),
        link: function ($scope) {
          $scope.updatePoNumber = function () {
            $scope.item.poNumber = $scope.item.poNumber || '';

            $scope.updateFunction()
              .then(function() {
                $scope.hideEditForm();
              });
          };

          $scope.hideEditForm = function () {
            $scope.editPoNumber = false;
          };
        }
      };
    }
  ]);
