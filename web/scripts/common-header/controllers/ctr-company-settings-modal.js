'use strict';

angular.module('risevision.common.header')
  .controller('CompanySettingsModalCtrl', ['$scope', '$modalInstance',
    'updateCompany', 'companyId', 'countries', 'REGIONS_CA', 'REGIONS_US',
    'TIMEZONES', 'getCompany', 'regenerateCompanyField', '$loading',
    'humanReadableError', 'userState', 'userAuthFactory', 'deleteCompany',
    'companyTracker', 'confirmModal', '$modal', '$templateCache',
    'COMPANY_INDUSTRY_FIELDS', 'COMPANY_SIZE_FIELDS', 'addressFactory',
    function ($scope, $modalInstance, updateCompany, companyId,
      countries, REGIONS_CA, REGIONS_US, TIMEZONES, getCompany,
      regenerateCompanyField, $loading, humanReadableError,
      userState, userAuthFactory, deleteCompany, companyTracker, confirmModal,
      $modal, $templateCache, COMPANY_INDUSTRY_FIELDS, COMPANY_SIZE_FIELDS, addressFactory) {

      $scope.company = {
        id: companyId
      };
      $scope.countries = countries;
      $scope.regionsCA = REGIONS_CA;
      $scope.regionsUS = REGIONS_US;
      $scope.timezones = TIMEZONES;
      $scope.COMPANY_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;
      $scope.COMPANY_SIZE_FIELDS = COMPANY_SIZE_FIELDS;
      $scope.isRiseStoreAdmin = userState.isRiseStoreAdmin();
      _clearErrorMessages();

      $scope.$watch('loading', function (loading) {
        if (loading) {
          $loading.start('company-settings-modal');
        } else {
          $loading.stop('company-settings-modal');
        }
      });

      $scope.loading = false;

      $scope.forms = {};

      if (companyId) {
        $scope.loading = true;
        getCompany(companyId).then(
          function (company) {
            $scope.company = company;
            $scope.company.isSeller = company && company.sellerId ? true : false;
            $scope.company.isChargebee = company && company.origin === 'Chargebee';
          },
          function (resp) {
            _showErrorMessage('load', resp);
          }).finally(function () {
          $scope.loading = false;
        });
      }
      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };
      $scope.save = function () {
        _clearErrorMessages();

        if (!$scope.forms.companyForm.$valid) {
          console.info('form not valid: ', $scope.forms.companyForm.$error);
        } else {
          $scope.loading = true;

          addressFactory.isValidOrEmptyAddress($scope.company).then(function () {
              var company = angular.copy($scope.company);

              verifyAdmin(company);
              return updateCompany($scope.company.id, company)
                .then(
                  function () {
                    companyTracker('Company Updated', userState.getSelectedCompanyId(),
                      userState.getSelectedCompanyName(), !userState.isSubcompanySelected());

                    userState.updateCompanySettings($scope.company);
                    $modalInstance.close('success');
                  }).catch(function (error) {
                  _showErrorMessage('update', error);
                });
            })
            .catch(function (error) {
              $scope.formError = 'We couldn\'t update your address.';
              $scope.apiError = humanReadableError(error);
              $scope.isAddressError = true;
            })
            .finally(function () {
              $scope.loading = false;
            });
        }
      };

      $scope.deleteCompany = function () {
        _clearErrorMessages();
        var instance = $modal.open({
          template: $templateCache.get('partials/common-header/safe-delete-modal.html'),
          controller: 'SafeDeleteModalCtrl'
        });
        instance.result.then(function () {
          $scope.loading = true;
          deleteCompany($scope.company.id)
            .then(
              function () {
                companyTracker('Company Deleted', userState.getSelectedCompanyId(),
                  userState.getSelectedCompanyName(), !userState.isSubcompanySelected());

                if (userState.getUserCompanyId() === $scope.company.id) {
                  userAuthFactory.signOut();
                } else if (userState.getSelectedCompanyId() === $scope.company
                  .id) {
                  userState.resetCompany();
                }
                $modalInstance.close('success');
              })
            .catch(
              function (error) {
                _showErrorMessage('delete', error);
              })
            .finally(function () {
              $scope.loading = false;
            });
        });
      };

      var _resetCompanyField = function (type, title, message) {
        _clearErrorMessages();

        return confirmModal(title, message)
          .then(function () {
            $loading.start('company-settings-modal');

            return regenerateCompanyField($scope.company.id, type)
              .catch(function (error) {
                _showErrorMessage('update', error);
              })
              .finally(function () {
                $loading.stop('company-settings-modal');
              });
          });
      };

      $scope.resetAuthKey = function () {
        var type = 'authKey';
        var title = 'Reset Authentication Key',
          message = 'Resetting the Company Authentication Key will cause existing Data Gadgets ' +
          'to no longer report data until they are updated with the new Key.';

        _resetCompanyField(type, title, message)
          .then(function (resp) {
            $scope.company.authKey = resp.item;
          });
      };

      $scope.resetClaimId = function () {
        var type = 'claimId';
        var title = 'Reset Claim Id',
          message = 'Resetting the Company Claim Id will cause existing installations to no ' +
          'longer be associated with your Company.';

        _resetCompanyField(type, title, message)
          .then(function (resp) {
            $scope.company.claimId = resp.item;
          });
      };

      function verifyAdmin(company) {
        if ($scope.isRiseStoreAdmin) {
          company.sellerId = company.isSeller ? 'yes' : null;
        } else {
          //exclude fields from API call
          delete company.sellerId;
          delete company.isTest;
          delete company.shareCompanyPlan;
        }
      }

      function _clearErrorMessages() {
        $scope.formError = null;
        $scope.apiError = null;
        $scope.isAddressError = false;
      }

      function _showErrorMessage(action, error) {
        $scope.formError = 'Failed to ' + action + ' Company.';
        $scope.apiError = humanReadableError(error);
      }

    }
  ]);
