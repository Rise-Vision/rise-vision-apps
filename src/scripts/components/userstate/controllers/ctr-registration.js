'use strict';

angular.module('risevision.common.components.userstate')
  .controller('RegistrationCtrl', [
    '$q', '$scope', '$rootScope',
    '$loading', 'addAccount', '$exceptionHandler',
    'userState', 'pick', 'messageBox', 'humanReadableError',
    'agreeToTermsAndUpdateUser', 'account', 'analyticsFactory',
    'bigQueryLogging', 'updateCompany', 'currentPlanFactory',
    'COMPANY_INDUSTRY_FIELDS', 'EDUCATION_INDUSTRIES', 'urlStateService', 'hubspot',
    function ($q, $scope, $rootScope, $loading, addAccount,
      $exceptionHandler, userState, pick, messageBox, humanReadableError,
      agreeToTermsAndUpdateUser, account, analyticsFactory, bigQueryLogging,
      updateCompany, currentPlanFactory, COMPANY_INDUSTRY_FIELDS, EDUCATION_INDUSTRIES, urlStateService, hubspot) {

      $scope.newUser = !account;
      $scope.DROPDOWN_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;

      var copyOfProfile = account ? account : userState.getCopyOfProfile() || {};

      $scope.company = {};

      $scope.profile = pick(copyOfProfile, 'email', 'firstName', 'lastName');
      $scope.profile.email = $scope.profile.email || userState.getUsername();
      $scope.registering = false;

      $scope.profile.accepted =
        angular.isDefined(copyOfProfile.termsAcceptanceDate) &&
        copyOfProfile.termsAcceptanceDate !== null;
      $scope.save = function () {
        $scope.forms.registrationForm.accepted.$pristine = false;
        $scope.forms.registrationForm.firstName.$pristine = false;
        $scope.forms.registrationForm.lastName.$pristine = false;
        $scope.forms.registrationForm.companyName.$pristine = false;
        $scope.forms.registrationForm.companyIndustry.$pristine = false;

        if (!$scope.forms.registrationForm.$invalid) {
          //update terms and conditions date
          $scope.registering = true;
          $loading.start('registration-modal');

          var action;
          if ($scope.newUser) {
            // Automatically subscribe education users on registration
            var mailSyncEnabled = EDUCATION_INDUSTRIES.indexOf($scope.company.companyIndustry) !== -1;

            action = addAccount($scope.profile.firstName, $scope.profile.lastName, $scope.company.name, $scope
              .company.companyIndustry, mailSyncEnabled);
          } else {
            // Automatically subscribe education users on registration
            $scope.profile.mailSyncEnabled = EDUCATION_INDUSTRIES.indexOf(account.companyIndustry) !== -1;

            action = agreeToTermsAndUpdateUser(userState.getUsername(), $scope.profile);
          }

          action
            .then(function () {
              userState.refreshProfile()
                .finally(function () {
                  if ($scope.newUser) {
                    currentPlanFactory.initVolumePlanTrial();
                  }

                  var userCompany = userState.getCopyOfUserCompany();
                  var userProfile = userState.getCopyOfProfile();
                  analyticsFactory.track('User Registered', {
                    'companyId': userState.getUserCompanyId(),
                    'companyName': userState.getUserCompanyName(),
                    'parentId': userCompany.parentId,
                    'isNewCompany': $scope.newUser,
                    'registeredDate': userProfile.creationDate,
                    'invitationAcceptedDate': $scope.newUser ? null : new Date()
                  });

                  hubspot.loadAs(userState.getUsername());

                  bigQueryLogging.logEvent('User Registered');

                  $rootScope.$broadcast('risevision.user.authorized');

                  $loading.stop('registration-modal');
                });
            })
            .catch(function (err) {
              messageBox('Error', humanReadableError(err));
              $exceptionHandler(err, 'User registration failed.', true);

              userState.refreshProfile();
            })
            .finally(function () {
              $scope.registering = false;
            });
        }

      };

      var populateIndustryFromUrl = function () {

        var industryName = urlStateService.getUrlParam('industry');

        if ($scope.newUser && industryName) {

          COMPANY_INDUSTRY_FIELDS.forEach(function (industry) {
            if (industryName === industry[0]) {
              $scope.company.companyIndustry = industry[1];
            }
          });
        }
      };

      populateIndustryFromUrl();

      $scope.forms = {};
    }
  ]);
