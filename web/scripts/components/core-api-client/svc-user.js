(function (angular) {
  'use strict';

  angular.module('risevision.core.userprofile', [
      'risevision.common.gapi'
    ])

    .value('userRoleMap', {
      'ce': 'Content Editor',
      'cp': 'Content Publisher',
      'da': 'Display Administrator',
      'ua': 'System Administrator',
      'pu': 'Store Purchaser',
      'sa': 'Rise System Administrator',
      'ba': 'Rise Store Administrator'
    })

    .constant('USER_WRITABLE_FIELDS', [
      'mailSyncEnabled', 'email', 'firstName', 'lastName', 'telephone',
      'roles', 'status', 'companyRole', 'dataCollectionDate', 'settings'
    ])

    .factory('getUserProfile', ['coreAPILoader', '$q', '$log',
      function (coreAPILoader, $q, $log) {
        var _username;
        var _cachedPromises = {};

        return function (username, clearCache) {

          var deferred;

          if (username === _username && !clearCache &&
            _cachedPromises[username] !== null) {
            //avoid calling API if username didn't change
            return _cachedPromises[username].promise;
          } else {
            _username = username;
            _cachedPromises[username] = deferred = $q.defer();
          }

          if (!username) {
            deferred.reject(
              'getUserProfile failed: username param is required.');
            $log.debug('getUserProfile failed: username param is required.');
          } else {

            var criteria = {};
            if (username) {
              criteria.username = username;
            }
            $log.debug('getUserProfile called', criteria);

            coreAPILoader().then(function (coreApi) {
              coreApi.user.get(criteria).execute(function (resp) {
                if (resp.error || !resp.result) {
                  deferred.reject(resp);
                } else {
                  $log.debug('getUser resp', resp);
                  //get user profile
                  deferred.resolve(resp.item);
                }
              });
            }, deferred.reject);
          }
          return deferred.promise;
        };
      }
    ])

    .factory('updateUser', ['$q', 'coreAPILoader', '$log',
      'getUserProfile', 'pick', 'USER_WRITABLE_FIELDS', 'userTracker', 'userState',
      function ($q, coreAPILoader, $log, getUserProfile, pick,
        USER_WRITABLE_FIELDS, userTracker, userState) {
        return function (username, profile) {
          var deferred = $q.defer();
          profile = pick(profile, USER_WRITABLE_FIELDS);
          $log.debug('updateUser called', username, profile);
          coreAPILoader().then(function (coreApi) {
            var request = coreApi.user.patch({
              username: username,
              data: profile
            });
            request.execute(function (resp) {
              $log.debug('updateUser resp', resp);
              if (resp.error) {
                deferred.reject(resp);
              } else if (resp.result) {
                getUserProfile(username, true).then(function () {
                  userTracker('User Updated', userState.getUsername(), userState.checkUsername(username), {
                    updatedUserId: username,
                    updatedUserCompanyRole: profile.companyRole ? profile.companyRole : ''
                  });
                  deferred.resolve(resp);
                });
              } else {
                deferred.reject('updateUser');
              }
            });
          }, deferred.reject);
          return deferred.promise;
        };
      }
    ])

    .factory('addUser', ['$q', 'coreAPILoader', '$log', 'pick',
      'getUserProfile',
      function ($q, coreAPILoader, $log, pick, getUserProfile) {
        return function (companyId, username, profile) {
          var deferred = $q.defer();
          coreAPILoader().then(function (coreApi) {
            profile = pick(profile, 'mailSyncEnabled',
              'email', 'firstName', 'lastName', 'telephone', 'roles',
              'status');
            var request = coreApi.user.add({
              username: username,
              companyId: companyId,
              data: profile
            });
            request.execute(function (resp) {
              $log.debug('addUser resp', resp);
              if (resp.result) {
                getUserProfile(username, true).then(function () {
                  deferred.resolve(resp);
                });
              } else {
                deferred.reject(resp);
              }
            });
          });
          return deferred.promise;
        };
      }
    ])

    .factory('deleteUser', ['$q', 'coreAPILoader', '$log',
      function ($q, coreAPILoader, $log) {
        return function (username) {
          var deferred = $q.defer();
          coreAPILoader().then(function (coreApi) {
            var request = coreApi.user.delete({
              username: username
            });
            request.execute(function (resp) {
              $log.debug('deleteUser resp', resp);
              if (resp.result) {
                deferred.resolve(resp);
              } else {
                deferred.reject(resp);
              }
            });
          });
          return deferred.promise;
        };
      }
    ])

    .factory('getUsers', ['$q', 'coreAPILoader', '$log',
      function ($q, coreAPILoader, $log) {
        return function (search, cursor) {
          var obj = {
            'companyId': search.companyId,
            'search': search.query,
            'cursor': cursor,
            'count': search.count,
            'sort': search.sortBy + (search.reverse ? ' desc' : ' asc')
          };

          $log.debug('getUsers', obj);
          var deferred = $q.defer();
          coreAPILoader().then(function (coreApi) {
            var request = coreApi.user.list(obj);
            request.execute(function (resp) {
              $log.debug('getUsers resp', resp);
              if (resp.result) {
                deferred.resolve(resp.result);
              } else {
                deferred.reject('getUsers');
              }
            });
          }, deferred.reject);
          return deferred.promise;
        };
      }
    ]);

})(angular);
