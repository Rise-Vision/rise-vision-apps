angular.module("risevision.common.header")
  .controller("RegistrationModalCtrl", [
    "$q", "$scope", "$rootScope", "$modalInstance",
    "$loading", "registerAccount", "$log", "$cookies",
    "userState", "pick", "uiFlowManager", "humanReadableError",
    "agreeToTermsAndUpdateUser", "account", "segmentAnalytics",
    "bigQueryLogging", "analyticsEvents", "updateCompany", "plansFactory",
    "COMPANY_INDUSTRY_FIELDS", "urlStateService",
    function ($q, $scope, $rootScope, $modalInstance, $loading, registerAccount,
      $log, $cookies, userState, pick, uiFlowManager, humanReadableError,
      agreeToTermsAndUpdateUser, account, segmentAnalytics, bigQueryLogging,
      analyticsEvents, updateCompany, plansFactory, COMPANY_INDUSTRY_FIELDS,
      urlStateService) {

      $scope.newUser = !account;
      $scope.DROPDOWN_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;

      var copyOfProfile = account ? account : userState.getCopyOfProfile() || {};

      $scope.company = {};

      //remove cookie so that it will show next time user refreshes page
      $cookies.remove("surpressRegistration");

      $scope.profile = pick(copyOfProfile, "email", "mailSyncEnabled",
        "firstName", "lastName");
      $scope.profile.email = $scope.profile.email || userState.getUsername();
      $scope.registering = false;

      $scope.profile.accepted =
        angular.isDefined(copyOfProfile.termsAcceptanceDate) &&
        copyOfProfile.termsAcceptanceDate !== null;

      if (!angular.isDefined($scope.profile.mailSyncEnabled)) {
        //"no sign up" by default
        $scope.profile.mailSyncEnabled = false;
      }

      // check status, load spinner, or close dialog if registration is complete
      var watch = $scope.$watch(
        function () {
          return uiFlowManager.isStatusUndetermined();
        },
        function (undetermined) {
          if (undetermined === true) {
            //start the spinner
            $loading.start("registration-modal");
          } else if (undetermined === false) {
            if (uiFlowManager.getStatus() === "registrationComplete") {
              $modalInstance.close("success");
              //stop the watch
              watch();
            }
            $loading.stop("registration-modal");
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
          $loading.start("registration-modal");

          var action;
          if ($scope.newUser) {
            action = registerAccount(userState.getUsername(), $scope.profile);
          } else {
            action = agreeToTermsAndUpdateUser(userState.getUsername(),
              $scope.profile);
          }

          action
            .then(function () {
                userState.refreshProfile()
                  .finally(function () {
                    if ($scope.newUser) {
                      updateCompany(userState.getUserCompanyId(), $scope.company)
                        .then(function () {
                          plansFactory.startVolumePlanTrial();
                        })
                        .finally(function () {
                          $rootScope.$broadcast(
                            "risevision.user.authorized");

                          $modalInstance.close("success");
                          $loading.stop("registration-modal");
                        });
                    }

                    analyticsEvents.identify();
                    segmentAnalytics.track("User Registered", {
                      "companyId": userState.getUserCompanyId(),
                      "companyName": userState.getUserCompanyName(),
                      "isNewCompany": $scope.newUser
                    });
                    bigQueryLogging.logEvent("User Registered");

                    if (!$scope.newUser) {
                      $rootScope.$broadcast(
                        "risevision.user.authorized");

                      $modalInstance.close("success");
                      $loading.stop("registration-modal");
                    }
                  });
              },
              function (err) {
                alert("Error: " + humanReadableError(err));
                console.error(err);
              })
            .finally(function () {
              $scope.registering = false;
              userState.refreshProfile();
            });
        }

      };

      var populateIndustryFromUrl = function () {

        var industryName = urlStateService.getUrlParam("industry");

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
