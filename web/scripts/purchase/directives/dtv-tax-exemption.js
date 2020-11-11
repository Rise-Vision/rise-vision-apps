'use strict';

angular.module('risevision.apps.purchase')
  .directive('taxExemption', ['$templateCache', 'purchaseFactory',
    function ($templateCache, purchaseFactory) {
      return {
        restrict: 'E',
        scope: {},
        template: $templateCache.get('partials/purchase/tax-exemption.html'),
        link: function ($scope) {
          $scope.taxExemption = purchaseFactory.purchase.taxExemption;
          $scope.factory = purchaseFactory;

          $scope.submit = function () {
            if ($scope.form.taxExemptionForm && $scope.form.taxExemptionForm.$invalid) {
              return;
            }

            purchaseFactory.submitTaxExemption();
          };

          $scope.applyTaxExemption = function () {
            if (!purchaseFactory.purchase.taxExemption.sent) {
              $scope.taxExemption.checked = !$scope.taxExemption.checked;
            }
          };

          $scope.selectFile = function () {
            setTimeout(function () {
              document.querySelector('#inputExemption').click();
            }, 0);
          };

          $scope.removeFile = function () {
            $scope.taxExemption.file = null;
            document.querySelector('#inputExemption').value = '';
          };

          $scope.setFile = function (element) {
            $scope.$apply(function () {
              $scope.taxExemption.file = element.files[0];
            });
          };

          $scope.isFieldInvalid = function (fieldName) {
            var form = $scope.form.taxExemptionForm;
            var field = form[fieldName];

            return (field.$dirty || form.$submitted) && field.$invalid;
          };

        }
      };
    }
  ]);
