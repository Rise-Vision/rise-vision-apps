(function (angular) {
  'use strict';
  /*jshint camelcase: false */

  angular.module('risevision.common.components.userstate')
    .factory('registrationFactory', ['$q', '$log', 
    'userState', 'getUserProfile', 'getAccount',
    '$rootScope', 'addAccount', '$exceptionHandler',
    'pick', 'messageBox', 'humanReadableError',
    'agreeToTermsAndUpdateUser', 'analyticsFactory',
    'bigQueryLogging', 'currentPlanFactory',
    'hubspot', 'EDUCATION_INDUSTRIES',
      function ($q, $log, userState, getUserProfile, getAccount,
        $rootScope, addAccount,
        $exceptionHandler, pick, messageBox, humanReadableError,
        agreeToTermsAndUpdateUser, analyticsFactory, bigQueryLogging,
        currentPlanFactory, hubspot, EDUCATION_INDUSTRIES) {
        var factory = {};

        var _reset = function() {
          factory.newUser = true;

          factory.profile = {};
          factory.company = {};
        };

        var _checkNewUser = function() {
          return getUserProfile(userState.getUsername())
            .catch(function (resp) {
              if (resp && resp.message === 'User has not yet accepted the Terms of Service') {
                factory.newUser = false;
              } else {
                factory.newUser = true;
              }
            });
        };

        var _getAccount = function() {
          return getAccount()
            .catch(function () {
              return null;
            });
        };

        factory.init = function() {
          _reset();

          factory.loading = true;

          $q.all([_getAccount(), _checkNewUser()])
            .then(function(result) {
              var account = result[0] || {};

              factory.profile = pick(account, 'email', 'firstName', 'lastName', 'mailSyncEnabled');
              factory.profile.email = factory.profile.email || userState.getUsername();
              factory.company.companyIndustry = account.companyIndustry;
            })
            .finally(function() {
              factory.loading = false;              
            });
        };

        var _isEducation = function (companyIndustry) {
          return EDUCATION_INDUSTRIES.indexOf(companyIndustry) !== -1;
        };

        factory.register = function() {
          var action;

          // Automatically subscribe education users on registration or if they were already subscribed
          factory.profile.mailSyncEnabled = factory.profile.mailSyncEnabled || _isEducation(factory.company.companyIndustry);

          factory.loading = true;              

          if (factory.newUser) {
            action = addAccount(factory.profile.firstName, factory.profile.lastName, factory.company.name, factory
              .company.companyIndustry, factory.profile.mailSyncEnabled);
          } else {
            action = agreeToTermsAndUpdateUser(userState.getUsername(), factory.profile);
          }

          action
            .then(function () {
              userState.refreshProfile()
                .finally(function () {
                  if (factory.newUser) {
                    currentPlanFactory.initVolumePlanTrial();
                  }

                  var userCompany = userState.getCopyOfUserCompany();
                  var userProfile = userState.getCopyOfProfile();
                  analyticsFactory.track('User Registered', {
                    'companyId': userState.getUserCompanyId(),
                    'companyName': userState.getUserCompanyName(),
                    'parentId': userCompany.parentId,
                    'isNewCompany': factory.newUser,
                    'registeredDate': userProfile.creationDate,
                    'invitationAcceptedDate': factory.newUser ? null : new Date()
                  });

                  hubspot.loadAs(userState.getUsername());

                  bigQueryLogging.logEvent('User Registered');

                  $rootScope.$broadcast('risevision.user.authorized');

                  factory.loading = false;              
                });
            })
            .catch(function (err) {
              messageBox('Error', humanReadableError(err));
              $exceptionHandler(err, 'User registration failed.', true);

              userState.refreshProfile();

              factory.loading = false;              
            });
        };

        return factory;
      }
    ]);

})(angular);
