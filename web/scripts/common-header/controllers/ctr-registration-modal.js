'use strict';

angular.module('risevision.common.header')
  .controller('RegistrationModalCtrl', [
    '$q', '$scope', '$rootScope', '$modalInstance',
    '$loading', 'addAccount', '$exceptionHandler',
    'userState', 'pick', 'uiFlowManager', 'messageBox', 'humanReadableError',
    'agreeToTermsAndUpdateUser', 'account', 'analyticsFactory',
    'bigQueryLogging', 'updateCompany', 'plansFactory',
    'COMPANY_INDUSTRY_FIELDS', 'urlStateService', 'getAccount',
    function ($q, $scope, $rootScope, $modalInstance, $loading, addAccount,
      $exceptionHandler, userState, pick, uiFlowManager, messageBox, humanReadableError,
      agreeToTermsAndUpdateUser, account, analyticsFactory, bigQueryLogging,
      updateCompany, plansFactory, COMPANY_INDUSTRY_FIELDS, urlStateService, getAccount) {

      $scope.newUser = !account;
      $scope.DROPDOWN_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;

      var copyOfProfile = account ? account : userState.getCopyOfProfile() || {};

      $scope.company = {};

      $scope.profile = pick(copyOfProfile, 'email', 'mailSyncEnabled',
        'firstName', 'lastName');
      $scope.profile.email = $scope.profile.email || userState.getUsername();
      $scope.registering = false;

      $scope.profile.accepted =
        angular.isDefined(copyOfProfile.termsAcceptanceDate) &&
        copyOfProfile.termsAcceptanceDate !== null;

      if (!angular.isDefined($scope.profile.mailSyncEnabled)) {
        //'no sign up' by default
        $scope.profile.mailSyncEnabled = false;
      }

      $scope.alreadyOptedIn = $scope.profile.mailSyncEnabled;

      if ($scope.newUser) {
        getAccount($scope.profile.email).then(function (subscriber) {
          if (subscriber && subscriber.mailSyncEnabled) {
            $scope.alreadyOptedIn = true;
          }
        });
      }

      // check status, load spinner, or close dialog if registration is complete
      var watch = $scope.$watch(
        function () {
          return uiFlowManager.isStatusUndetermined();
        },
        function (undetermined) {
          if (undetermined === true) {
            //start the spinner
            $loading.start('registration-modal');
          } else if (undetermined === false) {
            if (uiFlowManager.getStatus() === 'registrationComplete') {
              $modalInstance.close('success');
              //stop the watch
              watch();
            }
            $loading.stop('registration-modal');
          }
        });

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
            action = addAccount($scope.profile.firstName, $scope.profile.lastName, $scope.company.name, $scope
              .company.companyIndustry, $scope.profile.mailSyncEnabled);
          } else {
            action = agreeToTermsAndUpdateUser(userState.getUsername(),
              $scope.profile);
          }

          action
            .then(function () {
              userState.refreshProfile()
                .finally(function () {
                  if ($scope.newUser) {
                    plansFactory.initVolumePlanTrial();
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
                  bigQueryLogging.logEvent('User Registered');

                  $rootScope.$broadcast('risevision.user.authorized');

                  $modalInstance.close('success');
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
