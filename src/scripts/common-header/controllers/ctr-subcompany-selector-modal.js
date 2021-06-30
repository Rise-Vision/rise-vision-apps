'use strict';

angular.module('risevision.common.header')
  .controller('companySelectorCtr', ['$scope', '$modalInstance',
    'companyService', 'companyId', 'ScrollingListService',
    function ($scope, $modalInstance, companyService,
      companyId, ScrollingListService) {

      $scope.search = {
        companyId: companyId,
        sortBy: 'name',
        reverse: false,
        name: 'Companies'
      };

      $scope.companies = new ScrollingListService(companyService.getCompanies, $scope.search);

      $scope.filterConfig = {
        placeholder: 'Search Companies'
      };

      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.setCompany = function (company) {
        $modalInstance.close(company.id);
      };

    }
  ]);
