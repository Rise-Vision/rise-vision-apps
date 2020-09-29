'use strict';

angular.module('risevision.common.header')
  .controller('companySelectorCtr', ['$scope', '$loading', '$modalInstance',
    'companyService', 'companyId', 'ScrollingListService',
    function ($scope, $loading, $modalInstance, companyService,
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

      $scope.$watch('companies.loadingItems', function (loading) {
        if (loading) {
          $loading.start('company-selector-modal-list');
        } else {
          $loading.stop('company-selector-modal-list');
        }
      });

      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.setCompany = function (company) {
        $modalInstance.close(company.id);
      };

    }
  ]);
