'use strict';

angular.module('risevision.common.components.purchase-flow')
  .controller('TaxExemptionModalCtrl', ['$scope', '$modalInstance', '$loading', 'taxExemptionFactory',
    function ($scope, $modalInstance, $loading, taxExemptionFactory) {

      $scope.form = {};
      $scope.factory = taxExemptionFactory;

      taxExemptionFactory.init();

      // $scope.countries = COUNTRIES;
      // $scope.regionsCA = REGIONS_CA;
      // $scope.regionsUS = REGIONS_US;

      $scope.$watch('factory.loading', function (loading) {
        if (loading) {
          $loading.start('tax-exemption-modal');
        } else {
          $loading.stop('tax-exemption-modal');
        }
      });

      $scope.submit = function () {
        if ($scope.form.taxExemptionForm && $scope.form.taxExemptionForm.$invalid) {
          return;
        }

        return taxExemptionFactory.submitCertificate()
          .then(function () {
            if (!taxExemptionFactory.taxExemptionError) {
              $modalInstance.close(true);
            }
          });
      };

      $scope.close = function () {
        $modalInstance.dismiss();
      };

      $scope.selectFile = function () {
        setTimeout(function () {
          document.querySelector('#inputExemption').click();
        }, 0);
      };

      $scope.setFile = function (element) {
        $scope.$apply(function () {
          taxExemptionFactory.taxExemption.file = element.files[0];
        });
      };

      $scope.clearFile = function () {
        taxExemptionFactory.taxExemption.file = null;
        document.querySelector('#inputExemption').value = '';
      };

      // $scope.openDatepicker = function ($event) {
      //   $event.preventDefault();
      //   $event.stopPropagation();
      // 
      //   $scope.datepicker = true;
      // };

      // $scope.countryFilter = function (country) {
      //   return country.code === 'CA' || country.code === 'US';
      // };

      $scope.isFieldInvalid = function (fieldName) {
        var form = $scope.form.taxExemptionForm;
        var field = form[fieldName];

        return (field.$dirty || form.$submitted) && field.$invalid;
      };
    }
  ]);
