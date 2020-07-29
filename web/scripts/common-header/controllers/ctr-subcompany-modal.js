'use strict';
/*global alert: false */

angular.module('risevision.common.header')
  .controller('SubCompanyModalCtrl', ['$scope', '$modalInstance', '$modal',
    '$templateCache', 'createCompany', 'addressFactory', 'countries', 'REGIONS_CA',
    'REGIONS_US', 'TIMEZONES', 'userState', '$loading', 'humanReadableError',
    'companyTracker', 'bigQueryLogging', 'COMPANY_INDUSTRY_FIELDS',
    'COMPANY_SIZE_FIELDS',
    function ($scope, $modalInstance, $modal, $templateCache,
      createCompany, addressFactory, countries, REGIONS_CA, REGIONS_US, TIMEZONES, userState,
      $loading, humanReadableError, companyTracker, bigQueryLogging,
      COMPANY_INDUSTRY_FIELDS, COMPANY_SIZE_FIELDS) {

      $scope.company = {};
      $scope.countries = countries;
      $scope.regionsCA = REGIONS_CA;
      $scope.regionsUS = REGIONS_US;
      $scope.timezones = TIMEZONES;
      $scope.COMPANY_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;
      $scope.COMPANY_SIZE_FIELDS = COMPANY_SIZE_FIELDS;
      _clearErrorMessages();

      $scope.forms = {};

      $scope.$watch('loading', function (loading) {
        if (loading) {
          $loading.start('add-subcompany-modal');
        } else {
          $loading.stop('add-subcompany-modal');
        }
      });

      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.save = function () {
        _clearErrorMessages();

        if (!$scope.forms.companyForm.$valid) {
          console.info('form not valid: ', $scope.forms.companyForm.$error);
        } else {
          $scope.loading = true;

          addressFactory.validateAddressIfChanged($scope.forms.companyForm, $scope.company)
            .then(function () {
              createCompany(userState.getSelectedCompanyId(), $scope.company)
                .then(function (company) {
                  companyTracker('Company Created', company.id, company.name);

                  $modalInstance.close('success');
                }, function (err) {
                  $scope.formError = 'Failed to Add Sub-Company.';
                  $scope.apiError = humanReadableError(err);
                })
                .finally(function () {
                  $scope.loading = false;
                });

            })
            .catch(function (error) {
              $scope.loading = false;

              $scope.formError = 'We couldn\'t update your address.';
              $scope.apiError = humanReadableError(error);
              $scope.isAddressError = true;
            });
        }
      };

      // Show Move Company Modal
      $scope.moveCompany = function (size) {
        // var modalInstance =
        $modal.open({
          template: $templateCache.get('partials/common-header/move-company-modal.html'),
          controller: 'MoveCompanyModalCtrl',
          size: size
        });
      };

      function _clearErrorMessages() {
        $scope.formError = null;
        $scope.apiError = null;
        $scope.isAddressError = false;
      }
    }
  ]);
