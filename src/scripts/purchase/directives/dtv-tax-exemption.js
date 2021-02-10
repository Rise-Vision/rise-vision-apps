'use strict';

angular.module('risevision.apps.purchase')
  .directive('taxExemption', ['$templateCache', 'taxExemptionFactory',
    function ($templateCache, taxExemptionFactory) {
      return {
        restrict: 'E',
        scope: {
          showCancel: '='
        },
        template: $templateCache.get('partials/purchase/tax-exemption.html'),
        link: function ($scope) {
          $scope.taxExemption = taxExemptionFactory.taxExemption;

          $scope.submit = function () {
            if ($scope.form.taxExemptionForm && $scope.form.taxExemptionForm.$invalid) {
              return;
            }

            taxExemptionFactory.submitTaxExemption();
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
