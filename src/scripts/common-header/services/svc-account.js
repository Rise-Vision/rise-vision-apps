(function (angular) {

  'use strict';
  angular.module('risevision.common.account', [
      'risevision.common.gapi',
      'risevision.core.userprofile'
    ])

    .factory('agreeToTerms', ['$q', 'riseAPILoader', '$log',
      function ($q, riseAPILoader, $log) {
        return function () {
          $log.debug('agreeToTerms called.');
          var deferred = $q.defer();
          riseAPILoader().then(function (riseApi) {
            var request = riseApi.account.agreeToTerms();
            request.execute(function (resp) {
              $log.debug('agreeToTerms resp', resp);
              if (!resp.error) {
                deferred.resolve();
              } else {
                deferred.reject(resp.error);
              }
            });
          });
          return deferred.promise;
        };
      }
    ])

    .factory('agreeToTermsAndUpdateUser', ['$q', '$log',
      'agreeToTerms', 'updateUser',
      function ($q, $log, agreeToTerms, updateUser) {
        return function (username, basicProfile) {
          $log.debug('registerAccount called.', username, basicProfile);
          var deferred = $q.defer();
          agreeToTerms().then().finally(function () {
            updateUser(username, basicProfile).then(function (resp) {
              if (resp.result) {
                deferred.resolve();
              } else {
                deferred.reject();
              }
            }, deferred.reject).finally('registerAccount ended');
          });
          return deferred.promise;
        };
      }
    ])

    .factory('addAccount', ['$q', 'riseAPILoader', '$log',
      function ($q, riseAPILoader, $log) {
        return function (userFirst, userLast, companyName, companyIndustry, mailSyncEnabled) {
          $log.debug('addAccount called.');
          var deferred = $q.defer();
          riseAPILoader().then(function (riseApi) {
            var request = riseApi.account.addWithDetails({
              userFirst: userFirst,
              userLast: userLast,
              companyName: companyName,
              companyIndustry: companyIndustry,
              mailSyncEnabled: mailSyncEnabled
            });

            request.execute(function (resp) {
              $log.debug('addAccount resp', resp);
              if (resp.result) {
                deferred.resolve();
              } else {
                deferred.reject(resp);
              }
            });
          });
          return deferred.promise;
        };
      }
    ])

    .factory('getAccount', ['$q', 'riseAPILoader', '$log',
      function ($q, riseAPILoader, $log) {
        return function () {
          $log.debug('getAccount called.');
          var deferred = $q.defer();

          riseAPILoader().then(function (riseApi) {
            var request = riseApi.account.get();
            request.execute(function (resp) {
              $log.debug('getAccount resp', resp);
              if (resp.item) {
                deferred.resolve(resp.item);
              } else {
                deferred.reject('getAccount');
              }
            });
          });
          return deferred.promise;
        };
      }
    ]);

})(angular);
