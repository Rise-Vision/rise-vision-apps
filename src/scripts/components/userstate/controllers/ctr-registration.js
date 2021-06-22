'use strict';

angular.module('risevision.common.components.userstate')
  .controller('RegistrationCtrl', [
    '$scope', '$rootScope',
    '$loading', 'addAccount', '$exceptionHandler',
    'userState', 'pick', 'messageBox', 'humanReadableError',
    'agreeToTermsAndUpdateUser', 'newUser', 'account', 'analyticsFactory',
    'bigQueryLogging', 'currentPlanFactory',
    'COMPANY_INDUSTRY_FIELDS', 'EDUCATION_INDUSTRIES', 'urlStateService', 'hubspot',
    function ($scope, $rootScope, $loading, addAccount,
      $exceptionHandler, userState, pick, messageBox, humanReadableError,
      agreeToTermsAndUpdateUser, newUser, account, analyticsFactory, bigQueryLogging,
      currentPlanFactory, COMPANY_INDUSTRY_FIELDS, EDUCATION_INDUSTRIES, urlStateService, hubspot) {

      $scope.newUser = newUser;
      $scope.DROPDOWN_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;

      var copyOfProfile = account || {};

      $scope.company = {};

      $scope.profile = pick(copyOfProfile, 'email', 'firstName', 'lastName', 'mailSyncEnabled');
      $scope.profile.email = $scope.profile.email || userState.getUsername();
      $scope.registering = false;

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
            // Automatically subscribe education users on registration or if they were already subscribed
            $scope.profile.mailSyncEnabled = $scope.profile.mailSyncEnabled || isEducation($scope.company.companyIndustry);

            action = addAccount($scope.profile.firstName, $scope.profile.lastName, $scope.company.name, $scope
              .company.companyIndustry, $scope.profile.mailSyncEnabled);
          } else {
            // Automatically subscribe education users on registration or if they were already subscribed
            $scope.profile.mailSyncEnabled = $scope.profile.mailSyncEnabled || isEducation(copyOfProfile.companyIndustry);

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

      var isEducation = function (companyIndustry) {
        return EDUCATION_INDUSTRIES.indexOf(companyIndustry) !== -1;
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
