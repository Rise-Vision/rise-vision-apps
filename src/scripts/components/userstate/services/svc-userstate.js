(function (angular) {
  'use strict';

  angular.module('risevision.common.components.userstate')
    // constants (you can override them in your app as needed)
    .value('PROFILE_PICTURE_URL',
      'https://www.gravatar.com/avatar/{emailMD5}?d=mm')
    .factory('userState', ['$rootScope', '$window', '$log', '$location',
      'getUserProfile', 'companyState', 'objectHelper',
      'localStorageService', 'rvTokenStore', 'md5', 'PROFILE_PICTURE_URL',
      function ($rootScope, $window, $log, $location,
        getUserProfile, companyState, objectHelper,
        localStorageService, rvTokenStore, md5, PROFILE_PICTURE_URL) {
        //singleton factory that represents userState throughout application

        var _state = {
          profile: {}, //Rise vision profile
          user: {}, //Google user
          roleMap: {},
          userToken: rvTokenStore.read(),
          inRVAFrame: angular.isDefined($location.search() && $location.search().inRVA),
          isRiseAuthUser: false
        };

        var refreshProfile = function () {
          //populate profile if the current user is a rise vision user
          return getUserProfile(_state.user.username, true)
            .then(function (profile) {
              userState.updateUserProfile(profile);

              //populate company info
              return companyState.init();
            });
        };

        var isLoggedIn = function () {
          if (!_state.user.username) {
            return false;
          } else {
            return true;
          }
        };

        var isRiseVisionUser = function () {
          return _state.profile.username !== null &&
            _state.profile.username !== undefined;
        };

        var hasRole = function (role) {
          return angular.isDefined(_state.roleMap[role]);
        };

        var getAccessToken = function () {
          return $window.gapi && $window.gapi.auth ?
            $window.gapi.auth.getToken() : null;
        };

        var _restoreState = function () {
          var sFromStorage = localStorageService.get('risevision.common.userState');
          if (sFromStorage) {
            angular.extend(_state, sFromStorage);
            localStorageService.remove('risevision.common.userState'); //clear
            $log.debug('userState restored with', sFromStorage);
          }
        };

        var _resetState = function () {
          objectHelper.clearObj(_state.user);
          objectHelper.clearObj(_state.profile);
          _state.roleMap = {};

          companyState.resetCompanyState();
          $log.debug('User state has been reset.');
        };

        var _getEmailMD5 = function () {
          var emailHash = userState.getUsername() && md5.createHash(
            userState.getUsername());
          var gravatarId = emailHash || '0';
          return PROFILE_PICTURE_URL.replace('{emailMD5}', gravatarId);
        };

        var userState = {
          // user getters
          getUsername: function () {
            return (_state.user && _state.user.username) || null;
          },
          getUserFullName: function () {
            var firstName = (_state.profile && _state.profile.firstName) || '';
            var lastName = (_state.profile && _state.profile.lastName) || '';

            return (firstName + ' ' + lastName).trim();
          },
          getUserEmail: function () {
            return _state.profile.email;
          },
          getCopyOfProfile: function (noFollow) {
            if (noFollow) {
              return angular.extend({}, _state.profile);
            } else {
              return objectHelper.follow(_state.profile);
            }
          },
          getUserPicture: function () {
            return _state.user.picture || _getEmailMD5();
          },
          hasRole: hasRole,
          inRVAFrame: function () {
            return _state.inRVAFrame;
          },
          isRiseAdmin: function () {
            return hasRole('sa') && companyState.isRootCompany();
          },
          isRiseStoreAdmin: function () {
            return hasRole('ba') && companyState.isRootCompany();
          },
          isUserAdmin: function () {
            return hasRole('ua');
          },
          isPurchaser: function () {
            return hasRole('pu');
          },
          isRiseAuthUser: function () {
            return _state.isRiseAuthUser;
          },
          isSeller: companyState.isSeller,
          isRiseVisionUser: isRiseVisionUser,
          isLoggedIn: isLoggedIn,
          getAccessToken: getAccessToken,
          // user functions
          checkUsername: function (username) {
            return (username || false) &&
              (userState.getUsername() || false) &&
              username.toUpperCase() === userState.getUsername().toUpperCase();
          },
          updateUserProfile: function (user) {
            if (userState.checkUsername(user.username)) {
              objectHelper.clearAndCopy(angular.extend({
                username: _state.user.username
              }, user), _state.profile);

              //set role map
              _state.roleMap = {};
              if (_state.profile.roles) {
                _state.profile.roles.forEach(function (val) {
                  _state.roleMap[val] = true;
                });
              }

              $rootScope.$broadcast('risevision.user.updated');
            }
          },
          refreshProfile: refreshProfile,
          // company getters
          getUserCompanyId: companyState.getUserCompanyId,
          getUserCompanyName: companyState.getUserCompanyName,
          getSelectedCompanyId: companyState.getSelectedCompanyId,
          getSelectedCompanyName: companyState.getSelectedCompanyName,
          getSelectedCompanyCountry: companyState.getSelectedCompanyCountry,
          getCopyOfUserCompany: companyState.getCopyOfUserCompany,
          getCopyOfSelectedCompany: companyState.getCopyOfSelectedCompany,
          isSubcompanySelected: companyState.isSubcompanySelected,
          isTestCompanySelected: companyState.isTestCompanySelected,
          isRootCompany: companyState.isRootCompany,
          isSelectedCompanyChargebee: companyState.isSelectedCompanyChargebee,
          isEducationCustomer: companyState.isEducationCustomer,
          isDiscountCustomer: companyState.isDiscountCustomer,
          // company functions
          updateCompanySettings: companyState.updateCompanySettings,
          updateUserCompanySettings: companyState.updateUserCompanySettings,
          resetCompany: companyState.resetCompany,
          switchCompany: companyState.switchCompany,
          reloadSelectedCompany: companyState.reloadSelectedCompany,
          // private
          _restoreState: _restoreState,
          _resetState: _resetState,
          _persistState: function () {
            // persist user state
            localStorageService.set('risevision.common.userState', _state);
          },
          _state: _state,
          _setIsRiseAuthUser: function (isRiseAuthUser) {
            _state.isRiseAuthUser = isRiseAuthUser;
          }
        };

        return userState;
      }
    ]);

})(angular);
