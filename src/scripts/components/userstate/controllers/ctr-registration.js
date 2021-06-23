'use strict';

angular.module('risevision.common.components.userstate')
  .controller('RegistrationCtrl', ['$scope', '$loading', 'registrationFactory',
    'urlStateService', 'COMPANY_INDUSTRY_FIELDS',
    function ($scope, $loading, registrationFactory, urlStateService,
      COMPANY_INDUSTRY_FIELDS) {

      $scope.registrationFactory = registrationFactory;
      $scope.DROPDOWN_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;

      $scope.save = function () {
        $scope.forms.registrationForm.accepted.$pristine = false;
        $scope.forms.registrationForm.firstName.$pristine = false;
        $scope.forms.registrationForm.lastName.$pristine = false;
        $scope.forms.registrationForm.companyName.$pristine = false;
        $scope.forms.registrationForm.companyIndustry.$pristine = false;

        if (!$scope.forms.registrationForm.$invalid) {
          registrationFactory.register();
        }
      };

      var populateIndustryFromUrl = function () {

        var industryName = urlStateService.getUrlParam('industry');

        if (registrationFactory.newUser && industryName) {

          COMPANY_INDUSTRY_FIELDS.forEach(function (industry) {
            if (industryName === industry[0]) {
              registrationFactory.company.companyIndustry = industry[1];
            }
          });
        }
      };

      populateIndustryFromUrl();

      $scope.forms = {};

      $scope.$watch('registrationFactory.loading', function (loading) {
        if (loading) {
          $loading.start('registration-loader');
        } else {
          $loading.stop('registration-loader');
        }
      });

    }
  ]);
