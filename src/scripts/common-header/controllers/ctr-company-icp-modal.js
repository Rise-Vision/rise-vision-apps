'use strict';

angular.module('risevision.common.header')
  .controller('CompanyIcpModalCtrl', ['$scope', '$modalInstance', 'company',
    'COMPANY_INDUSTRY_FIELDS',
    function ($scope, $modalInstance, company, COMPANY_INDUSTRY_FIELDS) {

      $scope.company = company;
      $scope.DROPDOWN_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;

      $scope.save = function () {
        $modalInstance.close({
          company: company
        });
      };

    }
  ]);
